import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cita } from './cita.entity';

@Entity('barberos')
export class Barbero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  usuario: string; // Ej: 'carlos.mendoza'

  @Column({ select: false })
  password?: string; // El signo ? indica a TS que puede ser undefined // Hash encriptado con bcrypt

  @Column()
  especialidad: string;

  @Column({ nullable: true })
  fotoUrl: string;

  @Column({ default: 'Disponible' })
  estado: string;

  @OneToMany(() => Cita, (cita) => cita.barbero)
  citas: Cita[];
}