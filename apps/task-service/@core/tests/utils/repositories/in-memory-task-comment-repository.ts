import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { TaskComment } from '@core/domain/entities/task-comment';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskCommentWithAuthor } from '@core/domain/ports/types';
import { UserReadModel } from '@core/domain/entities/user-read-model';

export class InMemoryTaskCommentRepository extends TaskCommentRepository {
  public items: TaskComment[] = [];
  public users: Map<string, UserReadModel> = new Map();

  async create(entity: TaskComment): Promise<void> {
    this.items.push(entity);
  }

  async findMany(page: number, size: number): Promise<TaskComment[]> {
    const start = (page - 1) * size;
    return this.items.slice(start, start + size);
  }

  async findManyByTaskId(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskComment[]> {
    const filtered = this.items.filter(
      (comment) => comment.taskId.value === taskId.value,
    );
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  }

  async findManyByTaskIdWithAuthor(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskCommentWithAuthor[]> {
    const filtered = this.items.filter(
      (comment) => comment.taskId.value === taskId.value,
    );
    const start = (page - 1) * size;
    const paginated = filtered.slice(start, start + size);

    return paginated.map((comment) => {
      const author = this.users.get(comment.authorId.value);
      return {
        comment,
        author: {
          id: author?.id.value || '',
          name: author?.name || '',
          email: author?.email || '',
        },
      };
    });
  }

  addUser(user: UserReadModel): void {
    this.users.set(user.id.value, user);
  }
}
