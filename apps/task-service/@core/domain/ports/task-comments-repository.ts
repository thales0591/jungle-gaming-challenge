import { TaskComment } from '../entities/task-comment';
import { UniqueId } from '../value-objects/unique-id';

export abstract class TaskCommentRepository {
  abstract create(entity: TaskComment): Promise<void>;
  abstract findMany(page: number, size: number): Promise<TaskComment[]>;
  abstract findManyByTaskId(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskComment[]>;
}
