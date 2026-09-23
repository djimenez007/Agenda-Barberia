import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barbero } from '../Entities/barbero.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BarberosService {
  private readonly logger = new Logger(BarberosService.name);

  constructor(
    @InjectRepository(Barbero)
    private readonly barberoRepository: Repository<Barbero>,
  ) {}

  async findAll(): Promise<Barbero[]> {
    return this.barberoRepository.find();
  }

  async findOne(id: number): Promise<Barbero> {
    const barbero = await this.barberoRepository.findOneBy({ id });
    if (!barbero) {
      throw new NotFoundException(`Barbero con ID ${id} no encontrado`);
    }
    return barbero;
  }

  // Crear barbero encriptando su contraseña
  async create(data: {
    nombre: string;
    usuario: string;
    passwordPlain: string;
    especialidad: string;
    fotoUrl?: string;
  }): Promise<Barbero> {
    this.logger.log(`Registrando nuevo barbero: ${data.usuario}`);

    const usuarioExistente = await this.barberoRepository.findOneBy({
      usuario: data.usuario,
    });

    if (usuarioExistente) {
      throw new ConflictException(`El usuario ${data.usuario} ya existe`);
    }

    // Encriptar la contraseña (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.passwordPlain, salt);

    const nuevoBarbero = this.barberoRepository.create({
      nombre: data.nombre,
      usuario: data.usuario,
      password: hashedPassword,
      especialidad: data.especialidad,
      fotoUrl: data.fotoUrl,
    });

    const guardado = await this.barberoRepository.save(nuevoBarbero);
    delete guardado.password; // Evitamos retornar el hash en la respuesta
    return guardado;
  }

  // Autenticar barbero para inicio de sesión
  async login(usuario: string, passwordPlain: string): Promise<Barbero> {
    this.logger.log(`Intento de login para usuario: ${usuario}`);

    // Seleccionamos explícitamente el campo 'password' que está oculto por defecto
    const barbero = await this.barberoRepository
      .createQueryBuilder('barbero')
      .addSelect('barbero.password')
      .where('barbero.usuario = :usuario', { usuario })
      .getOne();

    if (!barbero) {
      this.logger.warn(`Login fallido: Usuario ${usuario} no existe`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const esPasswordValida = await bcrypt.compare(
      passwordPlain,
      barbero.password!, // El '!' le indica a TS que aquí sí es un string
    );

    if (!esPasswordValida) {
      this.logger.warn(`Login fallido: Contraseña incorrecta para ${usuario}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.log(`Login exitoso para barbero: ${barbero.nombre}`);
    delete barbero.password;
    return barbero;
  }
}