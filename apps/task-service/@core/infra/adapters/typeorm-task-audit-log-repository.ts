import { In, Repository } from 'typeorm';
import { TaskAuditLogRepository } from '@core/domain/ports/task-audit-log-repository';
import { TaskAuditLogEntity } from '../entities/task-audit-log.entity';
import { TaskAuditLog, TaskAuditAction } from '@core/domain/entities/task-audit-log';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { ITypeOrm } from '../typeorm-client';
import { TaskAuditLogWithUser } from '@core/domain/ports/types';
import { UserReadModelEntity } from '../entities/user-read-model.entity';

export class TypeOrmTaskAuditLogRepository extends TaskAuditLogRepository {
  private repository: Repository<TaskAuditLogEntity>;
  private userRepository: Repository<UserReadModelEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(TaskAuditLogEntity);
    this.userRepository = this.orm.dataSource.getRepository(UserReadModelEntity);
  }

  async create(auditLog: TaskAuditLog): Promise<void> {
    await this.repository.save({
      id: auditLog.id.value,
      taskId: auditLog.taskId.value,
      userId: auditLog.userId.value,
      action: auditLog.action,
      changes: auditLog.changes,
      createdAt: auditLog.createdAt ?? new Date(),
    });
  }

  async findManyByTaskIdWithUser(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskAuditLogWithUser[]> {
    const [rows] = await this.repository.findAndCount({
      where: { taskId: taskId.value },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    const userIds = rows.map((log) => log.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    const usersMap = new Map(users.map((user) => [user.id, user]));

    return rows.map((auditLog) => this.toDomainWithUser(auditLog, usersMap));
  }

  private toDomain(entity: TaskAuditLogEntity): TaskAuditLog {
    return TaskAuditLog.create(
      {
        taskId: UniqueId.create(entity.taskId),
        userId: UniqueId.create(entity.userId),
        action: entity.action as TaskAuditAction,
        changes: entity.changes,
        createdAt: entity.createdAt,
      },
      new UniqueId(entity.id),
    );
  }

  private toDomainWithUser(
    entity: TaskAuditLogEntity,
    usersMap: Map<string, UserReadModelEntity>,
  ): TaskAuditLogWithUser {
    const auditLog = this.toDomain(entity);
    const user = usersMap.get(entity.userId);

    if (!user) {
      throw new Error(`User not found for audit log ${entity.id}`);
    }

    return {
      auditLog,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    };
  }
}
