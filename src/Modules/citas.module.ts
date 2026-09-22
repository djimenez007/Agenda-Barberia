import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from '../Services/citas.service';
import { CitasController } from '../Controllers/citas.controller';
import { Cita } from '../Entities/cita.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}