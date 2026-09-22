import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barbero } from '../Entities/barbero.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BarberosService {
  constructor(
    @InjectRepository(Barbero)
    private readonly barberoRepository: Repository<Barbero>,
  ) {}

  async create(createBarberoDto: { nombre: string; especialidad: string; pin: string; estado?: string }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(createBarberoDto.pin, salt);

    const barbero = this.barberoRepository.create({
      ...createBarberoDto,
      pin: hashedPin,
    });

    return await this.barberoRepository.save(barbero);
  }

  async findAll() {
    return await this.barberoRepository.find();
  }

  async findOne(id: number) {
    const barbero = await this.barberoRepository.findOne({ where: { id } });
    if (!barbero) throw new NotFoundException(`Barbero con ID ${id} no encontrado`);
    return barbero;
  }

  async findByNombreWithPin(nombre: string) {
    return await this.barberoRepository
      .createQueryBuilder('barbero')
      .addSelect('barbero.pin')
      .where('barbero.nombre = :nombre', { nombre })
      .getOne();
  }

  async updateEstado(id: number, estado: string) {
    const barbero = await this.findOne(id);
    barbero.estado = estado;
    return await this.barberoRepository.save(barbero);
  }
}