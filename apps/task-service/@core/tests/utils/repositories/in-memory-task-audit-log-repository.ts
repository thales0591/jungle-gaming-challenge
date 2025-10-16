import { TaskAuditLogRepository } from '@core/domain/ports/task-audit-log-repository';
import { TaskAuditLog } from '@core/domain/entities/task-audit-log';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskAuditLogWithUser } from '@core/domain/ports/types';
import { UserReadModel } from '@core/domain/entities/user-read-model';

export class InMemoryTaskAuditLogRepository extends TaskAuditLogRepository {
  public items: TaskAuditLog[] = [];
  public users: Map<string, UserReadModel> = new Map();

  async create(entity: TaskAuditLog): Promise<void> {
    this.items.push(entity);
  }

  async findManyByTaskIdWithUser(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskAuditLogWithUser[]> {
    const filtered = this.items.filter(
      (log) => log.taskId.value === taskId.value,
    );
    const start = (page - 1) * size;
    const paginated = filtered.slice(start, start + size);

    return paginated.map((auditLog) => {
      const user = this.users.get(auditLog.userId.value);
      return {
        auditLog,
        user: {
          id: user?.id.value || '',
          name: user?.name || '',
          email: user?.email || '',
        },
      };
    });
  }

  addUser(user: UserReadModel): void {
    this.users.set(user.id.value, user);
  }
}
