import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { BarberosService } from '../Services/barberos.service';

@Controller('barberos')
export class BarberosController {
  constructor(private readonly barberosService: BarberosService) {}

  @Post()
  create(@Body() createBarberoDto: { nombre: string; especialidad: string; pin: string; estado?: string }) {
    return this.barberosService.create(createBarberoDto);
  }

  @Get()
  findAll() {
    return this.barberosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barberosService.findOne(+id);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.barberosService.updateEstado(+id, estado);
  }
}