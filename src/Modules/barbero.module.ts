import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberosService } from '../Services/barberos.service';
import { BarberosController } from '../Controllers/barberos.controller';
import { Barbero } from '../Entities/barbero.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbero])],
  controllers: [BarberosController],
  providers: [BarberosService],
  exports: [BarberosService],
})
export class BarberosModule {}