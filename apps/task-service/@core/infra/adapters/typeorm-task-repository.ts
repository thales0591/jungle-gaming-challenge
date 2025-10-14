import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskStatus, TaskPriority } from '@core/domain/entities/task';
import { TaskRepository } from '@core/domain/ports';
import { ITypeOrm } from '../typeorm-client';
import { UserReadModelEntity } from '../entities/user-read-model.entity';
import { DomainException } from '@core/domain/exceptions/domain-exception';
import { DomainTaskWithUsers, TaskFilters } from '@core/domain/ports/types';

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
    const existingTask = await this.repository.findOne({
      where: { id: task.id.value },
      relations: ['assignedUsers'],
    });

    if (!existingTask) {
      throw new DomainException(`Task ${task.id.value} not found`);
    }

    const userIds = task.assignedUserIds.map((id) => id.value);
    const assignedUsers = userIds.length
      ? await this.userRepository.find({ where: { id: In(userIds) } })
      : [];

    existingTask.title = task.title;
    existingTask.description = task.description;
    existingTask.dueDate = task.dueDate;
    existingTask.priority = task.priority;
    existingTask.status = task.status;
    existingTask.assignedUsers = assignedUsers;
    existingTask.updatedAt = task.updatedAt ?? new Date();

    await this.repository.save(existingTask);
  }

  async findManyWithUsers(
    userId: string,
    page: number,
    size: number,
    filters?: TaskFilters,
  ): Promise<DomainTaskWithUsers[]> {
    let query = this.repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUser')
      .leftJoin('task.assignedUsers', 'user')
      .where('(task.authorId = :userId OR user.id = :userId)', { userId });

    if (filters?.status) {
      query = query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      query = query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    query = this.applySorting(query, filters?.sortBy);

    const rows = await query
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

  private applySorting(
    query: SelectQueryBuilder<TaskEntity>,
    sortBy?: string,
  ): SelectQueryBuilder<TaskEntity> {
    switch (sortBy) {
      case 'oldest':
        return query.orderBy('task.createdAt', 'ASC');
      case 'due-date':
        return query
          .orderBy('task.dueDate', 'ASC', 'NULLS LAST')
          .addOrderBy('task.createdAt', 'DESC');
      case 'priority':
        return query
          .addOrderBy(
            `CASE task.priority
              WHEN 'URGENT' THEN 1
              WHEN 'HIGH' THEN 2
              WHEN 'MEDIUM' THEN 3
              WHEN 'LOW' THEN 4
              ELSE 5
            END`,
            'ASC',
          )
          .addOrderBy('task.createdAt', 'DESC');
      case 'newest':
      default:
        return query.orderBy('task.createdAt', 'DESC');
    }
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
