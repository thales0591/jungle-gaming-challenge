import { Repository } from 'typeorm';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { TaskCommentEntity } from '../entities/task-comment.entity';
import { TaskComment } from '@core/domain/entities/task-comment';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { ITypeOrm } from '../typeorm-client';

export class TypeOrmTaskCommentsRepository extends TaskCommentRepository {
  private repository: Repository<TaskCommentEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(TaskCommentEntity);
  }

  async create(comment: TaskComment): Promise<void> {
    await this.repository.insert({
      id: comment.id.value,
      taskId: comment.taskId.value,
      authorId: comment.authorId.value,
      content: comment.content,
      createdAt: comment.createdAt ?? new Date(),
    });
  }

  async findMany(page: number, size: number): Promise<TaskComment[]> {
    const [rows] = await this.repository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findManyByTaskId(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskComment[]> {
    const [rows] = await this.repository.findAndCount({
      where: { taskId: taskId.value },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'ASC' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  private toDomain(entity: TaskCommentEntity): TaskComment {
    return TaskComment.create(
      {
        taskId: UniqueId.create(entity.taskId),
        authorId: UniqueId.create(entity.authorId),
        content: entity.content,
        createdAt: entity.createdAt,
      },
      new UniqueId(entity.id),
    );
  }
}
