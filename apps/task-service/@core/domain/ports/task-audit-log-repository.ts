import { TaskAuditLog } from '../entities/task-audit-log';
import { UniqueId } from '../value-objects/unique-id';
import { TaskAuditLogWithUser } from './types';

export abstract class TaskAuditLogRepository {
  abstract create(entity: TaskAuditLog): Promise<void>;
  abstract findManyByTaskIdWithUser(
    taskId: UniqueId,
    page: number,
    size: number,
  ): Promise<TaskAuditLogWithUser[]>;
}
