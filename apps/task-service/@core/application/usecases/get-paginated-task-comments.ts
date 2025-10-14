import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants';
import { TaskComment } from '@core/domain/entities/task-comment';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export interface GetPaginatedTaskCommentsUseCaseRequest {
  taskId: UniqueId;
  size: number;
  page: number;
}

export class GetPaginatedTaskCommentsUseCase {
  constructor(private readonly taskCommentRepository: TaskCommentRepository) {}

  async execute(props: GetPaginatedTaskCommentsUseCaseRequest): Promise<TaskComment[]> {
    const page = Math.max(1, props.page ?? DEFAULT_PAGE);
    const size = Math.max(1, props.size ?? DEFAULT_SIZE);
    return this.taskCommentRepository.findManyByTaskId(props.taskId, page, size);
  }
}
