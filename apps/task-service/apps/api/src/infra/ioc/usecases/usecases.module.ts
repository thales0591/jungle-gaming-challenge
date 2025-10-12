import {
  CreateTaskCommentUseCase,
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindTaskByIdUseCase,
  GetPaginatedTaskCommentsUseCase,
  GetPaginatedTasksUseCase,
  UpdateTaskUseCase,
} from '@core/application/usecases';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { MessagingModule } from '../../messaging/messaging.module';
import { EventPublisher } from '@core/application/ports/event-publisher';

@Module({
  imports: [DatabaseModule, MessagingModule],
  providers: [
    {
      provide: CreateTaskUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        userReadModelRepository: UserReadModelRepository,
        eventPublisher: EventPublisher,
      ) => {
        return new CreateTaskUseCase(taskRepository, userReadModelRepository, eventPublisher);
      },
      inject: [TaskRepository, UserReadModelRepository, EventPublisher],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (taskRepository: TaskRepository) => {
        return new DeleteTaskUseCase(taskRepository);
      },
      inject: [TaskRepository, UserReadModelRepository],
    },
    {
      provide: FindTaskByIdUseCase,
      useFactory: (taskRepository: TaskRepository) => {
        return new FindTaskByIdUseCase(taskRepository);
      },
      inject: [TaskRepository, UserReadModelRepository],
    },
    {
      provide: GetPaginatedTasksUseCase,
      useFactory: (taskRepository: TaskRepository) => {
        return new GetPaginatedTasksUseCase(taskRepository);
      },
      inject: [TaskRepository, UserReadModelRepository],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (taskRepository: TaskRepository, eventPublisher: EventPublisher) => {
        return new UpdateTaskUseCase(taskRepository, eventPublisher);
      },
      inject: [TaskRepository, EventPublisher],
    },
    {
      provide: GetPaginatedTaskCommentsUseCase,
      useFactory: (taskCommentRepository: TaskCommentRepository) => {
        return new GetPaginatedTaskCommentsUseCase(taskCommentRepository);
      },
      inject: [TaskCommentRepository],
    },
    {
      provide: CreateTaskCommentUseCase,
      useFactory: (
        taskCommentRepository: TaskCommentRepository,
        userReadModelRepository: UserReadModelRepository,
        taskRepository: TaskRepository,
        eventPublisher: EventPublisher,
      ) => {
        return new CreateTaskCommentUseCase(
          taskCommentRepository,
          userReadModelRepository,
          taskRepository,
          eventPublisher,
        );
      },
      inject: [TaskCommentRepository, UserReadModelRepository, TaskRepository, EventPublisher],
    },
  ],
  exports: [
    CreateTaskUseCase,
    DeleteTaskUseCase,
    FindTaskByIdUseCase,
    GetPaginatedTasksUseCase,
    UpdateTaskUseCase,
    CreateTaskCommentUseCase,
    GetPaginatedTaskCommentsUseCase,
  ],
})
export class UseCasesModule {}
