import { In, Repository } from 'typeorm';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { TaskCommentEntity } from '../entities/task-comment.entity';
import { TaskComment } from '@core/domain/entities/task-comment';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { ITypeOrm } from '../typeorm-client';
import { TaskCommentWithAuthor } from '@core/domain/ports/types';
import { UserReadModelEntity } from '../entities/user-read-model.entity';

export class TypeOrmTaskCommentsRepository extends TaskCommentRepository {
  private repository: Repository<TaskCommentEntity>;
  private userRepository: Repository<UserReadModelEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(TaskCommentEntity);
    this.userRepository = this.orm.dataSource.getRepository(UserReadModelEntity);
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

  async findManyByTaskIdWithAuthor(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskCommentWithAuthor[]> {
    const [rows] = await this.repository.findAndCount({
      where: { taskId: taskId.value },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'ASC' },
    });

    const authorIds = rows.map((c) => c.authorId);
    const authors = await this.userRepository.find({
      where: { id: In(authorIds) },
    });
    const authorsMap = new Map(authors.map((user) => [user.id, user]));

    return rows.map((taskComment) => this.toDomainWithAuthor(taskComment, authorsMap));
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

  private toDomainWithAuthor(
    entity: TaskCommentEntity,
    authorsMap: Map<string, UserReadModelEntity>,
  ): TaskCommentWithAuthor {
    const comment = this.toDomain(entity);
    const author = authorsMap.get(entity.authorId);

    if (!author) {
      throw new Error(`Author not found for comment ${entity.id}`);
    }

    return {
      comment,
      author: {
        id: author.id,
        name: author.username,
        email: author.email,
      },
    };
  }
}
