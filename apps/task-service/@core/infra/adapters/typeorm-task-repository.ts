import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskStatus, TaskPriority } from '@core/domain/entities/task';
import { TaskRepository } from '@core/domain/ports';
import { ITypeOrm } from '../typeorm-client';

export class TypeOrmTaskRepository extends TaskRepository {
  private repository: Repository<TaskEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(TaskEntity);
  }

  async create(task: Task): Promise<void> {
    await this.repository.insert({
      id: task.id.value,
      authorId: task.authorId.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignedUserIds: task.assignedUserIds.map((id) => id.value),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? new Date(),
    });
  }

  async save(task: Task): Promise<void> {
    await this.repository.update(task.id.value, {
      id: task.id.value,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignedUserIds: task.assignedUserIds.map((id) => id.value),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? new Date(),
    });
  }

  async findMany(page: number, size: number): Promise<Task[]> {
    const [rows] = await this.repository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });
    return rows.map((t) => this.toDoamain(t)!);
  }

  async findById(id: UniqueId): Promise<Task | null> {
    const task = await this.repository.findOne({ where: { id: id.value } });
    return this.toDoamain(task);
  }

  async update(task: Task): Promise<void> {
    await this.repository.save({
      id: task.id.value,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignedUserIds: task.assignedUserIds.map((id) => id.value),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt ?? new Date(),
    });
  }

  async delete(id: UniqueId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private toDoamain(task: TaskEntity | null): Task | null {
    if (!task) return null;

    const {
      id,
      title,
      description,
      dueDate,
      priority,
      status,
      assignedUserIds,
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
        assignedUserIds: (assignedUserIds ?? []).map((id) =>
          UniqueId.create(id),
        ),
        createdAt,
        updatedAt,
      },
      new UniqueId(id),
    );
  }
}
