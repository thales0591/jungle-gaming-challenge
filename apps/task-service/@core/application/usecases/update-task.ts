import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { TaskRepository } from '@core/domain/ports/task-repository';
import { TaskPriority, TaskStatus } from '@core/domain/entities/task';

export interface UpdateTaskProps {
  id: UniqueId;
  authorId?: UniqueId;
  title?: string;
  description?: string;
  dueDate?: Date | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: UniqueId[];
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute({
    id,
    authorId,
    title,
    description,
    dueDate,
    priority,
    status,
    assignedUserIds,
  }: UpdateTaskProps): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundException('Task not found');

    task.update({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedUserIds,
      authorId,
    });

    await this.taskRepository.update(task);
    return task;
  }
}
