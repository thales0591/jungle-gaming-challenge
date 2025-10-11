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

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: CreateTaskUseCase,
      useFactory: (
        taskRepository: TaskRepository,
        userReadModelRepository: UserReadModelRepository,
      ) => {
        return new CreateTaskUseCase(taskRepository, userReadModelRepository);
      },
      inject: [TaskRepository, UserReadModelRepository],
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
      useFactory: (taskRepository: TaskRepository) => {
        return new UpdateTaskUseCase(taskRepository);
      },
      inject: [TaskRepository, UserReadModelRepository],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (taskRepository: TaskRepository) => {
        return new UpdateTaskUseCase(taskRepository);
      },
      inject: [TaskRepository, UserReadModelRepository],
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
      ) => {
        return new CreateTaskCommentUseCase(
          taskCommentRepository,
          userReadModelRepository,
          taskRepository,
        );
      },
      inject: [TaskCommentRepository, UserReadModelRepository, TaskRepository],
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
