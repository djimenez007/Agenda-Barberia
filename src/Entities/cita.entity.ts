import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Barbero } from '../Entities/barbero.entity.js';
import { Servicio } from '../Entities/servicio.entity.js';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clienteNombre: string;

  @Column()
  clienteTelefono: string;

  @Column({ nullable: true })
  clienteEmail: string;

  @Column({ type: 'date' })
  fecha: string; // Formato YYYY-MM-DD

  @Column({ type: 'time' })
  hora: string; // Formato HH:mm

  @Column({ default: 'Pendiente' })
  estado: string; // Pendiente, Completada, Cancelada

  @ManyToOne(() => Barbero, (barbero) => barbero.citas, { eager: true, onDelete: 'SET NULL' })
  barbero: Barbero;

  @ManyToOne(() => Servicio, (servicio) => servicio.citas, { eager: true, onDelete: 'SET NULL' })
  servicio: Servicio;

  @CreateDateColumn()
  creadoEn: Date;
}