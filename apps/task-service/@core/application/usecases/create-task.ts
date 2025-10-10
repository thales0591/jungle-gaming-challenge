import { Task, TaskPriority, TaskStatus } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { NotFoundException } from '@nestjs/common';

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

    const task = Task.create({
      title,
      description,
      status,
      dueDate: dueDate ?? null,
      assignedUserIds,
      priority,
      authorId,
    });

    await this.taskRepository.save(task);

    return task;
  }
}
