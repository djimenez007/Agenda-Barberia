import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HorariosService } from '../Services/horarios.service';
import { HorarioBarbero } from '../Entities/horario-barbero.entity';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Get('barbero/:barberoId')
  findByBarbero(@Param('barberoId') barberoId: string): Promise<HorarioBarbero[]> {
    return this.horariosService.findByBarbero(+barberoId);
  }

  @Post()
  create(@Body() body: Partial<HorarioBarbero>): Promise<HorarioBarbero> {
    return this.horariosService.create(body);
  }
}