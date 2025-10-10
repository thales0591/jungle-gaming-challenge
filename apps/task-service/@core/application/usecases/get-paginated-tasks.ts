import { Task } from '@core/domain/entities/task';
import { TaskRepository } from '@core/domain/ports/task-repository';
import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants';

export interface GetPaginatedTasksUseCaseRequest {
  size: number;
  page: number;
}

export class GetPaginatedTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(props: GetPaginatedTasksUseCaseRequest): Promise<Task[]> {
    const page = Math.max(1, props.page ?? DEFAULT_PAGE);
    const size = Math.max(1, props.size ?? DEFAULT_SIZE);
    return this.taskRepository.findMany(page, size);
  }
}
