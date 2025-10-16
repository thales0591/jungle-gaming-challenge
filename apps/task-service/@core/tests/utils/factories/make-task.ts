import { Task, TaskProps, TaskStatus, TaskPriority } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueId,
): Task {
  const authorId = override.authorId || UniqueId.create();

  return Task.create(
    {
      authorId,
      title: 'Test Task',
      description: 'Test task description',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      assignedUserIds: [],
      ...override,
    },
    id,
  );
}
