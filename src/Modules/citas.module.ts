import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from '../Entities/cita.entity';
import { Cliente } from '../Entities/cliente.entity';
import { Barbero } from '../Entities/barbero.entity';
import { Servicio } from '../Entities/servicio.entity';
import { CitasService } from '../Services/citas.service';
import { CitasController } from '../Controllers/citas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, Cliente, Barbero, Servicio])],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [CitasService],
})
export class CitasModule {}