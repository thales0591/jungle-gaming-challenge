import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { join, resolve } from 'path';

const entitiesGlob = [join(__dirname, 'entities', '**', '*.{ts,js}')];
const migrationsGlob = [join(__dirname, '../../apps/api/src/infra/ioc/database/migrations', '*.{ts,js}')];

loadEnv({ path: resolve(__dirname, '../../.env') });

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: entitiesGlob,
  migrations: migrationsGlob,
};

const dataSource = new DataSource(options);
export default dataSource;
