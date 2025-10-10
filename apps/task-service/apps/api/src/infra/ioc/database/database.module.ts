import { Module } from '@nestjs/common';
import { ITypeOrm } from '@core/infra/typeorm-client';
import { TypeOrmService } from './typeorm.service';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { TypeOrmUserReadModelRepository } from '@core/infra/adapters/typeorm-user-repository';
import { TypeOrmTaskRepository } from '@core/infra/adapters/typeorm-task-repository';

@Module({
  providers: [
    {
      provide: ITypeOrm,
      useClass: TypeOrmService,
    },
    {
      provide: TaskRepository,
      useFactory: (orm: ITypeOrm) => {
        return new TypeOrmTaskRepository(orm);
      },
      inject: [ITypeOrm],
    },    
    {
      provide: UserReadModelRepository,
      useFactory: (orm: ITypeOrm) => {
        return new TypeOrmUserReadModelRepository(orm);
      },
      inject: [ITypeOrm],
    },
  ],
  exports: [TaskRepository, UserReadModelRepository, ITypeOrm],
})
export class DatabaseModule {}
