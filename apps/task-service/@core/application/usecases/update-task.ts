import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { TaskRepository } from '@core/domain/ports/task-repository';
import { TaskPriority, TaskStatus } from '@core/domain/entities/task';
import { EventPublisher } from '../ports/event-publisher';

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
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

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
    const richTask = await this.taskRepository.findById(id);
    if (!richTask) throw new NotFoundException('Task not found');

    const task = richTask.task;

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

    await this.eventPublisher.emit('task.updated', {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      authorId: task.authorId.toString(),
      assignedUserIds: task.assignedUserIds.map((id) => id.toString()),
      updatedAt: task.updatedAt,
    });

    return task;
  }
}
