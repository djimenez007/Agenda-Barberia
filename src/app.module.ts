import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BarberosModule } from './Modules/barbero.module';
import { ServiciosModule } from './Modules/servicios.module';
import { CitasModule } from './Modules/citas.module';
import { ClientesModule } from './Modules/clientes.module';
import { HorariosModule } from './Modules/horarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    BarberosModule,
    ServiciosModule,
    CitasModule,
    ClientesModule,
    HorariosModule,
  ],
})
export class AppModule {}