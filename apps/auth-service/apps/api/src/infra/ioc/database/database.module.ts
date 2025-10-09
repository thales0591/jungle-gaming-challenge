import { Module } from '@nestjs/common';
import { TypeOrmService } from './typeorm.service';
import { UserRepository } from '@core/domain/ports';
import { TypeOrmUserRepository } from '@core/infra/adapters/typeorm-user-repository';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@core/infra/entities/user.entity';

@Module({
  providers: [
    {
      provide: TypeOrmService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new TypeOrmService({
          type: 'postgres',
          host: configService.getOrThrow('DB_HOST'),
          port: configService.getOrThrow('DB_PORT'),
          username: configService.getOrThrow('POSTGRES_USER'),
          password: configService.getOrThrow('POSTGRES_PASSWORD'),
          database: configService.getOrThrow('POSTGRES_DB'),
          synchronize: false,
          entities: [UserEntity],
          migrations: ['./migrations/*.ts'],
        });
      },
    },
    {
      provide: UserRepository,
      useFactory: (orm: TypeOrmService) => {
        return new TypeOrmUserRepository(orm);
      },
      inject: [TypeOrmService],
    },
  ],
  exports: [UserRepository, TypeOrmService],
})
export class DatabaseModule {}
