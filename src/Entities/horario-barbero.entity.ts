import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Barbero } from './barbero.entity';

@Entity('horarios_barberos')
export class HorarioBarbero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diaSemana: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  @Column({ type: 'time' })
  horaInicio: string; // ej. "08:00:00"

  @Column({ type: 'time' })
  horaFin: string; // ej. "17:00:00"

  @ManyToOne(() => Barbero, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'barberoId' })
  barbero: Barbero;
}