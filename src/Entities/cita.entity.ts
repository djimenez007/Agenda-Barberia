import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Barbero } from './barbero.entity';
import { Servicio } from './servicio.entity';
import { Cliente } from './cliente.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  // Guarda la fecha y hora completa con zona horaria (UTC)
  @Column({ type: 'timestamptz' })
  fechaHoraUTC: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioTotal: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ default: 'Pendiente' })
  estado: string; // 'Pendiente', 'Completada', 'Cancelada'

  // Foreign Key a Cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.citas, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  // Foreign Key a Barbero
  @ManyToOne(() => Barbero, (barbero) => barbero.citas, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'barberoId' })
  barbero: Barbero;

  // Foreign Key a Servicio
  @ManyToOne(() => Servicio, (servicio) => servicio.citas, { eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'servicioId' })
  servicio: Servicio;

  @CreateDateColumn()
  creadoEn: Date;
}