import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from '../Entities/servicio.entity.js';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: { nombre: string; precio: number; duracionMinutos: number }) {
    const servicio = this.servicioRepository.create(createServicioDto);
    return await this.servicioRepository.save(servicio);
  }

  async findAll() {
    return await this.servicioRepository.find();
  }

  async findOne(id: number) {
    const servicio = await this.servicioRepository.findOne({ where: { id } });
    if (!servicio) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    return servicio;
  }
}