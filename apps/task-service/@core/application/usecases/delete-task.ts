import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { TaskRepository } from '@core/domain/ports';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: UniqueId): Promise<void> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.delete(id);
  }
}
