import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BarberosService } from './Services/barberos.service';
import { ServiciosService } from './Services/servicios.service';
import { ClientesService } from './Services/clientes.service';
import { CitasService } from './Services/citas.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const barberosService = app.get(BarberosService);
  const serviciosService = app.get(ServiciosService);
  const clientesService = app.get(ClientesService);
  const citasService = app.get(CitasService);

  console.log('--- Sincronizando y sembrando datos en Supabase ---');

  // 1. Crear Barberos con usuario y clave
  const b1 = await barberosService.create({
    nombre: 'Carlos Mendoza',
    usuario: 'carlos.mendoza',
    passwordPlain: 'Barber2026!',
    especialidad: 'Cortes Clásicos y Barba',
  });

  const b2 = await barberosService.create({
    nombre: 'David Ruiz',
    usuario: 'david.ruiz',
    passwordPlain: 'Vintage2026!',
    especialidad: 'Degradados y Diseños Modernos',
  });

  console.log('✓ Barberos creados con credenciales seguras');

  // 2. Crear Servicios
  const s1 = await serviciosService.create({
    nombre: 'Corte Tradicional',
    precio: 15.0,
    duracionMinutos: 30,
  });
  const s2 = await serviciosService.create({
    nombre: 'Perfilado de Barba',
    precio: 10.0,
    duracionMinutos: 20,
  });
  const s3 = await serviciosService.create({
    nombre: 'Combo Vintage (Corte + Barba)',
    precio: 22.0,
    duracionMinutos: 50,
  });

  console.log('✓ Servicios creados');

  // 3. Crear Cliente de prueba
  const cliente = await clientesService.findOrCreate(
    'Gabriel Solís',
    '88888888',
    'gabriel@ejemplo.com',
  );

  // 4. Crear Cita de prueba
  const fechaManana = new Date();
  fechaManana.setDate(fechaManana.getDate() + 1);
  fechaManana.setHours(15, 0, 0, 0);

  await citasService.create({
    clienteId: cliente.id,
    barberoId: b1.id,
    servicioId: s3.id,
    fechaHoraUTC: fechaManana.toISOString(),
    notas: 'Cliente prefiere degradado bajo con navaja.',
  });

  console.log('--- Siembra completada exitosamente ---');
  await app.close();
}

bootstrap();