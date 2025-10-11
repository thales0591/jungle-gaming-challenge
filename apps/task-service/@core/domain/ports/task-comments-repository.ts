import { TaskComment } from '../entities/task-comment';

export abstract class TaskCommentRepository {
  abstract create(entity: TaskComment): Promise<void>;
  abstract findMany(page: number, size: number): Promise<TaskComment[]>;
}
