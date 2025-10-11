import { Module } from '@nestjs/common';
import { UseCasesModule } from '../../ioc/usecases/usecases.module';
import { TaskCommentController } from './task-comment.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [TaskCommentController],
})
export class TaskCommentModule {}
