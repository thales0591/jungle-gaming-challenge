import { TaskRepository } from '@core/domain/ports/task-repository';
import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants';
import { DomainTaskWithUsers, TaskSortBy } from '@core/domain/ports/types';
import { TaskStatus, TaskPriority } from '@core/domain/entities/task';

export interface GetPaginatedTasksUseCaseRequest {
  userId: string;
  size: number;
  page: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortBy;
}

export class GetPaginatedTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    props: GetPaginatedTasksUseCaseRequest,
  ): Promise<DomainTaskWithUsers[]> {
    const page = Math.max(1, props.page ?? DEFAULT_PAGE);
    const size = Math.max(1, props.size ?? DEFAULT_SIZE);
    return this.taskRepository.findManyWithUsers(
      props.userId,
      page,
      size,
      {
        status: props.status,
        priority: props.priority,
        sortBy: props.sortBy,
      }
    );
  }
}
