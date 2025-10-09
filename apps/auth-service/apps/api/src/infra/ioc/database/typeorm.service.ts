import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';

@Injectable()
export class TypeOrmService extends DataSource implements OnModuleInit {
  constructor(options: DataSourceOptions) {
    super(options);
  }

  async onModuleInit() {
    await this.initialize();
  }
}
