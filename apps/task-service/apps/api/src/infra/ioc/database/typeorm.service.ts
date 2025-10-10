import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ITypeOrm } from '@core/infra/typeorm-client';
import { UserReadModelEntity } from '../../../../../../@core/infra/entities/user-read-model.entity';
import { TaskEntity } from '../../../../../../@core/infra/entities/task.entity';

@Injectable()
export class TypeOrmService extends ITypeOrm {
  private readonly _dataSource: DataSource;

  constructor(private readonly config: ConfigService) {
    super();

    this._dataSource = new DataSource({
      type: 'postgres',
      host: config.getOrThrow('DB_HOST'),
      port: config.getOrThrow('DB_PORT'),
      username: config.getOrThrow('POSTGRES_USER'),
      password: config.getOrThrow('POSTGRES_PASSWORD'),
      database: config.getOrThrow('POSTGRES_DB'),
      synchronize: false,
      entities: [UserReadModelEntity, TaskEntity],
    });
  }

  get dataSource(): DataSource {
    return this._dataSource;
  }

  async initialize(): Promise<void> {
    if (!this._dataSource.isInitialized) {
      await this._dataSource.initialize();
    }
  }

  async onModuleInit() {
    if (!this._dataSource.isInitialized) {
      await this._dataSource.initialize();
    }
  }
}
