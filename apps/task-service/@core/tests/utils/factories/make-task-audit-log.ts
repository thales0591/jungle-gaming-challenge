import {
  TaskAuditLog,
  TaskAuditLogProps,
  TaskAuditAction,
} from '@core/domain/entities/task-audit-log';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export function makeTaskAuditLog(
  override: Partial<TaskAuditLogProps> = {},
  id?: UniqueId,
): TaskAuditLog {
  return TaskAuditLog.create(
    {
      taskId: UniqueId.create(),
      userId: UniqueId.create(),
      action: TaskAuditAction.CREATED,
      changes: { changes: [] },
      ...override,
    },
    id,
  );
}
