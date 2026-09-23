import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../Entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find();
  }

  async findOne(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async findOrCreate(nombre: string, telefono: string, email?: string): Promise<Cliente> {
    let cliente = await this.clienteRepository.findOneBy({ telefono });
    if (!cliente) {
      cliente = this.clienteRepository.create({ nombre, telefono, email });
      await this.clienteRepository.save(cliente);
    }
    return cliente;
  }
}