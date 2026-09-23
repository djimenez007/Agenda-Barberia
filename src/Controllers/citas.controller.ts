import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { CitasService } from '../Services/citas.service';
import { Cita } from '../Entities/cita.entity';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Get()
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Cita> {
    return this.citasService.findOne(+id);
  }
  
  @Get('barbero/:barberoId')
  findByBarbero(@Param('barberoId') barberoId: string): Promise<Cita[]> {
    return this.citasService.findByBarbero(+barberoId);
  }

  @Post()
  create(
    @Body()
    body: {
      clienteId: number;
      barberoId: number;
      servicioId: number;
      fechaHoraUTC: string;
      notas?: string;
    },
  ): Promise<Cita> {
    return this.citasService.create(body);
  }

  @Patch(':id/cancelar')
  cancelarCita(@Param('id') id: string): Promise<Cita> {
    return this.citasService.cancelarCita(+id);
  }
}