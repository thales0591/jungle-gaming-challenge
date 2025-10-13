import { Task, TaskPriority, TaskStatus } from '@core/domain/entities/task';

export class TaskWithUsersResponse {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly dueDate: Date | null,
    readonly priority: TaskPriority,
    readonly status: TaskStatus,
    readonly assignedUsers: {
      id: string;
      name: string;
      email: string;
    }[],
    readonly author: {
      id: string;
      name: string;
      email: string;
    },
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static from(params: {
    task: Task;
    author: { id: string; name: string; email: string };
    assignedUsers: { id: string; name: string; email: string }[];
  }): TaskWithUsersResponse {
    const { task, author, assignedUsers } = params;

    return new TaskWithUsersResponse(
      task.id.value,
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      task.status,
      assignedUsers,
      author,
      task.createdAt,
      task.updatedAt ?? task.createdAt,
    );
  }
}
