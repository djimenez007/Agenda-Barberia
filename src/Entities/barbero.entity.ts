import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cita } from '../Entities/cita.entity.js';

@Entity('barberos')
export class Barbero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column({ default: 'Disponible' })
  estado: string; // Ej: Disponible, En descanso, De vacaciones

  @Column({ select: false }) // Oculta el PIN en consultas normales por seguridad
  pin: string;

  @OneToMany(() => Cita, (cita) => cita.barbero)
  citas: Cita[];
}