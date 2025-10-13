import { TaskRepository } from '@core/domain/ports/task-repository';
import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants';
import { DomainTaskWithUsers } from '@core/domain/ports/types';

export interface GetPaginatedTasksUseCaseRequest {
  userId: string
  size: number;
  page: number;
}

export class GetPaginatedTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    props: GetPaginatedTasksUseCaseRequest,
  ): Promise<DomainTaskWithUsers[]> {
    const page = Math.max(1, props.page ?? DEFAULT_PAGE);
    const size = Math.max(1, props.size ?? DEFAULT_SIZE);
    return this.taskRepository.findManyWithUsers(props.userId, page, size);
  }
}
