import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Cita } from './cita.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  telefono: string; // WhatsApp / Teléfono (único para identificarlo)

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Cita, (cita) => cita.cliente)
  citas: Cita[];

  @CreateDateColumn()
  registradoEn: Date;
}