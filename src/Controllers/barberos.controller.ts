import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BarberosService } from '../Services/barberos.service';
import { Barbero } from '../Entities/barbero.entity';

@Controller('barberos')
export class BarberosController {
  constructor(private readonly barberosService: BarberosService) {}

  @Get()
  findAll(): Promise<Barbero[]> {
    return this.barberosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Barbero> {
    return this.barberosService.findOne(+id);
  }

  @Post('registro')
  create(
    @Body()
    body: {
      nombre: string;
      usuario: string;
      passwordPlain: string;
      especialidad: string;
      fotoUrl?: string;
    },
  ): Promise<Barbero> {
    return this.barberosService.create(body);
  }

  @Post('login')
  login(
    @Body() body: { usuario: string; passwordPlain: string },
  ): Promise<Barbero> {
    return this.barberosService.login(body.usuario, body.passwordPlain);
  }
}