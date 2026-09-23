import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClientesService } from '../Services/clientes.service';
import { Cliente } from '../Entities/cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll(): Promise<Cliente[]> {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cliente> {
    return this.clientesService.findOne(+id);
  }

  @Post()
  create(@Body() body: { nombre: string; telefono: string; email?: string }): Promise<Cliente> {
    return this.clientesService.findOrCreate(body.nombre, body.telefono, body.email);
  }
}