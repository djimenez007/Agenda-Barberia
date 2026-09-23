import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from '../Entities/cita.entity';
import { Cliente } from '../Entities/cliente.entity';
import { Barbero } from '../Entities/barbero.entity';
import { Servicio } from '../Entities/servicio.entity';

@Injectable()
export class CitasService {
  private readonly logger = new Logger(CitasService.name);

  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Barbero)
    private readonly barberoRepository: Repository<Barbero>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  // 1. Obtener todas las citas
  async findAll(): Promise<Cita[]> {
    this.logger.log('Consultando todas las citas');
    return this.citaRepository.find();
  }

  // 2. Buscar cita por ID con manejo de 404
  async findOne(id: number): Promise<Cita> {
    this.logger.log(`Buscando cita con ID: ${id}`);
    const cita = await this.citaRepository.findOneBy({ id });

    if (!cita) {
      this.logger.warn(`Cita con ID ${id} no encontrada`);
      throw new NotFoundException(`La cita con ID ${id} no existe`);
    }

    return cita;
  }

  // 3. Crear una nueva cita con validaciones y conversión de hora UTC
  async create(data: {
    clienteId: number;
    barberoId: number;
    servicioId: number;
    fechaHoraUTC: string | Date;
    notas?: string;
  }): Promise<Cita> {
    this.logger.log(`Intentando crear cita para el cliente ID: ${data.clienteId}`);

    const cliente = await this.clienteRepository.findOneBy({ id: data.clienteId });
    if (!cliente) throw new NotFoundException(`Cliente con ID ${data.clienteId} no existe`);

    const barbero = await this.barberoRepository.findOneBy({ id: data.barberoId });
    if (!barbero) throw new NotFoundException(`Barbero con ID ${data.barberoId} no existe`);

    const servicio = await this.servicioRepository.findOneBy({ id: data.servicioId });
    if (!servicio) throw new NotFoundException(`Servicio con ID ${data.servicioId} no existe`);

    const fechaHora = new Date(data.fechaHoraUTC);

    // Validar si el barbero ya tiene una cita agendada en la misma fecha/hora
    const citaExistente = await this.citaRepository.findOne({
      where: {
        barbero: { id: barbero.id },
        fechaHoraUTC: fechaHora,
        estado: 'Pendiente',
      },
    });

    if (citaExistente) {
      this.logger.warn(`Conflict: El barbero ${barbero.nombre} ya tiene una cita a las ${fechaHora.toISOString()}`);
      throw new ConflictException('El barbero no está disponible en el horario seleccionado');
    }

    const nuevaCita = this.citaRepository.create({
      cliente,
      barbero,
      servicio,
      fechaHoraUTC: fechaHora,
      precioTotal: servicio.precio,
      notas: data.notas,
      estado: 'Pendiente',
    });

    const citaGuardada = await this.citaRepository.save(nuevaCita);
    this.logger.log(`Cita creada con éxito con ID: ${citaGuardada.id}`);

    return citaGuardada;
  }

  // 4. Cancelar cita con Logs y 404
  async cancelarCita(id: number): Promise<Cita> {
    this.logger.log(`Intentando cancelar la cita con ID: ${id}`);

    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita) {
      this.logger.warn(`No se encontró la cita ID: ${id} para cancelar`);
      throw new NotFoundException(`La cita con ID ${id} no existe`);
    }

    if (cita.estado === 'Cancelada') {
      throw new BadRequestException(`La cita ID ${id} ya se encuentra cancelada`);
    }

    cita.estado = 'Cancelada';
    const citaActualizada = await this.citaRepository.save(cita);

    this.logger.log(`Cita ID ${id} cancelada con éxito`);
    return citaActualizada;
  }

  // 5. Obtener citas por barbero con Logs
  async findByBarbero(barberoId: number): Promise<Cita[]> {
    this.logger.log(`Consultando citas del barbero ID: ${barberoId}`);
    return this.citaRepository.find({
      where: { barbero: { id: barberoId } },
    });
  }
}