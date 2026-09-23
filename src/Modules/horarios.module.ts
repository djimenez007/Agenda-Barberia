import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioBarbero } from '../Entities/horario-barbero.entity';
import { HorariosService } from '../Services/horarios.service';
import { HorariosController } from '../Controllers/horarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioBarbero])],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [HorariosService],
})
export class HorariosModule {}