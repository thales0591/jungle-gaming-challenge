import { Task, TaskPriority, TaskStatus } from '@core/domain/entities/task';

export class TaskResponse {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly dueDate: Date | null,
    readonly priority: TaskPriority,
    readonly status: TaskStatus,
    readonly assignedUserIds: string[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static from(domain: Task): TaskResponse {
    return new TaskResponse(
      domain.id.value,
      domain.title,
      domain.description,
      domain.dueDate,
      domain.priority,
      domain.status,
      domain.assignedUserIds.map((id) => id.value),
      domain.createdAt,
      domain.updatedAt ?? domain.createdAt,
    );
  }
}
