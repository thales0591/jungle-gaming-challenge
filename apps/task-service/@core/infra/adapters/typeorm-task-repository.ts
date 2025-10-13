import { In, Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskStatus, TaskPriority } from '@core/domain/entities/task';
import { TaskRepository } from '@core/domain/ports';
import { ITypeOrm } from '../typeorm-client';
import { UserReadModelEntity } from '../entities/user-read-model.entity';
import { DomainException } from '@core/domain/exceptions/domain-exception';
import { DomainTaskWithUsers } from '@core/domain/ports/types';

export class TypeOrmTaskRepository extends TaskRepository {
  private repository: Repository<TaskEntity>;
  private userRepository: Repository<UserReadModelEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(TaskEntity);
    this.userRepository =
      this.orm.dataSource.getRepository(UserReadModelEntity);
  }

  async create(task: Task): Promise<void> {
    const userIds = task.assignedUserIds.map((id) => id.value);
    const assignedUsers = userIds.length
      ? await this.userRepository.find({ where: { id: In(userIds) } })
      : [];

    await this.repository.save({
      id: task.id.value,
      authorId: task.authorId.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? new Date(),
      assignedUsers,
    });
  }

  async update(task: Task): Promise<void> {
    const userIds = task.assignedUserIds.map((id) => id.value);
    const assignedUsers = userIds.length
      ? await this.userRepository.find({ where: { id: In(userIds) } })
      : [];

    await this.repository.update(task.id.value, {
      id: task.id.value,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? new Date(),
      assignedUsers,
    });
  }

  async findManyWithUsers(
    userId: string,
    page: number,
    size: number,
  ): Promise<DomainTaskWithUsers[]> {
    const rows = await this.repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUser')
      .leftJoin('task.assignedUsers', 'user')
      .where('task.authorId = :userId', { userId })
      .orWhere('user.id = :userId', { userId })
      .orderBy('task.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    const authorIds = rows.map((t) => t.authorId);
    const authors = await this.userRepository.find({
      where: { id: In(authorIds) },
    });
    const authorsMap = new Map(authors.map((u) => [u.id, u]));

    return rows.map((t) => this.toDomainWithUsers(t, authorsMap));
  }

  async findById(id: UniqueId): Promise<DomainTaskWithUsers | null> {
    const task = await this.repository.findOne({
      where: { id: id.value },
      relations: ['assignedUsers'],
    });
    if (!task) return null;

    const author = await this.userRepository.findOneOrFail({
      where: { id: task.authorId },
    });
    const authorsMap = new Map([[task.authorId, author]]);
    return this.toDomainWithUsers(task, authorsMap);
  }

  async delete(id: UniqueId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private toDomain(task: TaskEntity | null): Task | null {
    if (!task) return null;

    const {
      id,
      title,
      description,
      dueDate,
      priority,
      status,
      assignedUsers = [],
      createdAt,
      updatedAt,
      authorId,
    } = task;

    return Task.create(
      {
        title,
        authorId: UniqueId.create(authorId),
        description,
        dueDate,
        priority: priority as TaskPriority,
        status: status as TaskStatus,
        assignedUserIds: assignedUsers.map((user) => UniqueId.create(user.id)),
        createdAt,
        updatedAt,
      },
      new UniqueId(id),
    );
  }

  private toDomainWithUsers(
    taskEntity: TaskEntity,
    authorsMap: Map<string, UserReadModelEntity>,
  ): DomainTaskWithUsers {
    const domainTask = this.toDomain(taskEntity)!;
    const author = authorsMap.get(taskEntity.authorId);

    if (!author) {
      throw new DomainException(`Author not found for task ${taskEntity.id}`);
    }

    return {
      task: domainTask,
      author: {
        id: author.id,
        name: author.username,
        email: author.email,
      },
      assignedUsers:
        taskEntity.assignedUsers?.map((user) => ({
          id: user.id,
          name: user.username,
          email: user.email,
        })),
    };
  }
}
