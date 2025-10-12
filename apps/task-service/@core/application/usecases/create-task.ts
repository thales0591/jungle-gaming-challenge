import { Task, TaskPriority, TaskStatus } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { NotFoundException } from '@nestjs/common';
import { EventPublisher } from '../ports/event-publisher';

export interface CreateTaskProps {
  authorId: UniqueId;
  title: string;
  description: string;
  dueDate?: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUserIds: UniqueId[];
}

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userReadModelRepository: UserReadModelRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    title,
    description,
    authorId,
    assignedUserIds,
    dueDate,
    priority,
    status,
  }: CreateTaskProps): Promise<Task> {
    const user = await this.userReadModelRepository.findById(authorId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const foundUsers =
      await this.userReadModelRepository.findManyByIds(assignedUserIds);

    if (foundUsers.length !== assignedUserIds.length) {
      throw new NotFoundException('Some assigned users do not exist');
    }

    const task = Task.create({
      title,
      description,
      status,
      dueDate: dueDate ?? null,
      assignedUserIds,
      priority,
      authorId,
    });

    await this.taskRepository.create(task);

    await this.eventPublisher.emit('task.created', {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      authorId: task.authorId.toString(),
      assignedUserIds: task.assignedUserIds.map(id => id.toString()),
      createdAt: task.createdAt,
    });

    return task;
  }
}
