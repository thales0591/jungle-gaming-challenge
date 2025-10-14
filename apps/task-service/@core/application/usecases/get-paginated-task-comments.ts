import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskCommentWithAuthor } from '@core/domain/ports/types';

export interface GetPaginatedTaskCommentsUseCaseRequest {
  taskId: UniqueId;
  size: number;
  page: number;
}

export class GetPaginatedTaskCommentsUseCase {
  constructor(private readonly taskCommentRepository: TaskCommentRepository) {}

  async execute(props: GetPaginatedTaskCommentsUseCaseRequest): Promise<TaskCommentWithAuthor[]> {
    const page = Math.max(1, props.page ?? DEFAULT_PAGE);
    const size = Math.max(1, props.size ?? DEFAULT_SIZE);
    return this.taskCommentRepository.findManyByTaskIdWithAuthor(props.taskId, page, size);
  }
}
