import {
  CreateTaskCommentUseCase,
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindTaskByIdUseCase,
  GetPaginatedTaskCommentsUseCase,
  GetPaginatedTasksUseCase,
  UpdateTaskUseCase,
} from '@core/application/usecases';
import { GetTaskAuditLogsUseCase } from '@core/application/usecases/get-task-audit-logs';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { TaskAuditLogRepository } from '@core/domain/ports/task-audit-log-repository';
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
        taskAuditLogRepository: TaskAuditLogRepository,
      ) => {
        return new CreateTaskUseCase(
          taskRepository,
          userReadModelRepository,
          eventPublisher,
          taskAuditLogRepository,
        );
      },
      inject: [TaskRepository, UserReadModelRepository, EventPublisher, TaskAuditLogRepository],
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
      useFactory: (
        taskRepository: TaskRepository,
        eventPublisher: EventPublisher,
        taskAuditLogRepository: TaskAuditLogRepository,
      ) => {
        return new UpdateTaskUseCase(taskRepository, eventPublisher, taskAuditLogRepository);
      },
      inject: [TaskRepository, EventPublisher, TaskAuditLogRepository],
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
    {
      provide: GetTaskAuditLogsUseCase,
      useFactory: (taskAuditLogRepository: TaskAuditLogRepository) => {
        return new GetTaskAuditLogsUseCase(taskAuditLogRepository);
      },
      inject: [TaskAuditLogRepository],
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
    GetTaskAuditLogsUseCase,
  ],
})
export class UseCasesModule {}
