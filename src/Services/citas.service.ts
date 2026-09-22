import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from '../Entities/cita.entity.js';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) {}

  async create(createCitaDto: {
    clienteNombre: string;
    clienteTelefono: string;
    clienteEmail?: string;
    fecha: string;
    hora: string;
    barberoId: number;
    servicioId: number;
  }) {
    const cita = this.citaRepository.create({
      clienteNombre: createCitaDto.clienteNombre,
      clienteTelefono: createCitaDto.clienteTelefono,
      clienteEmail: createCitaDto.clienteEmail,
      fecha: createCitaDto.fecha,
      hora: createCitaDto.hora,
      barbero: { id: createCitaDto.barberoId },
      servicio: { id: createCitaDto.servicioId },
    });

    return await this.citaRepository.save(cita);
  }

  async findAll() {
    return await this.citaRepository.find({
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  async findByBarbero(barberoId: number, fecha?: string) {
    const whereCondition: any = { barbero: { id: barberoId } };
    if (fecha) {
      whereCondition.fecha = fecha;
    }

    return await this.citaRepository.find({
      where: whereCondition,
      order: { hora: 'ASC' },
    });
  }

  async updateEstado(id: number, estado: string) {
    const cita = await this.citaRepository.findOne({ where: { id } });
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    
    cita.estado = estado;
    return await this.citaRepository.save(cita);
  }
}