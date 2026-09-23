import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorarioBarbero } from '../Entities/horario-barbero.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(HorarioBarbero)
    private readonly horarioRepository: Repository<HorarioBarbero>,
  ) {}

  findByBarbero(barberoId: number): Promise<HorarioBarbero[]> {
    return this.horarioRepository.find({
      where: { barbero: { id: barberoId } },
    });
  }

  create(data: Partial<HorarioBarbero>): Promise<HorarioBarbero> {
    const horario = this.horarioRepository.create(data);
    return this.horarioRepository.save(horario);
  }
}