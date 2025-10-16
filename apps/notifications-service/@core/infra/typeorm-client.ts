import { DataSource } from 'typeorm';

export abstract class ITypeOrm {
  abstract get dataSource(): DataSource;
}
