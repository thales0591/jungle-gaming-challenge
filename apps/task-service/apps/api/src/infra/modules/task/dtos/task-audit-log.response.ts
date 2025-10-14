import { TaskAuditLogWithUser } from '@core/domain/ports/types';
import { TaskAuditAction, AuditLogChanges } from '@core/domain/entities/task-audit-log';

export class TaskAuditLogResponse {
  constructor(
    readonly id: string,
    readonly taskId: string,
    readonly userId: string,
    readonly userName: string,
    readonly userEmail: string,
    readonly action: TaskAuditAction,
    readonly changes: AuditLogChanges,
    readonly createdAt: Date | null,
  ) {}

  static from(domain: TaskAuditLogWithUser): TaskAuditLogResponse {
    return new TaskAuditLogResponse(
      domain.auditLog.id.value,
      domain.auditLog.taskId.toString(),
      domain.user.id,
      domain.user.name,
      domain.user.email,
      domain.auditLog.action,
      domain.auditLog.changes,
      domain.auditLog.createdAt ?? null,
    );
  }
}
