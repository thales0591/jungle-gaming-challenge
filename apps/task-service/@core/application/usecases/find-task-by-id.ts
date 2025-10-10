import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { TaskRepository } from '@core/domain/ports/';

export class FindTaskByIdUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: UniqueId): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
