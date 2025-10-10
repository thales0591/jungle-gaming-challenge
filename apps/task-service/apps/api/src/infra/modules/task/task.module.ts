import { Module } from '@nestjs/common';
import { UseCasesModule } from '../../ioc/usecases/usecases.module';
import { TaskController } from './task.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [TaskController],
})
export class TaskModule {}
