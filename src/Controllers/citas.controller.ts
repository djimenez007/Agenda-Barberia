import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { CitasService } from '../Services/citas.service';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(
    @Body()
    createCitaDto: {
      clienteNombre: string;
      clienteTelefono: string;
      clienteEmail?: string;
      fecha: string;
      hora: string;
      barberoId: number;
      servicioId: number;
    },
  ) {
    return this.citasService.create(createCitaDto);
  }

  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @Get('barbero/:barberoId')
  findByBarbero(@Param('barberoId') barberoId: string, @Query('fecha') fecha?: string) {
    return this.citasService.findByBarbero(+barberoId, fecha);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.citasService.updateEstado(+id, estado);
  }
}