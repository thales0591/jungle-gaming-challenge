import { TaskAuditLog, TaskAuditAction } from '@core/domain/entities/task-audit-log';
import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('TaskAuditLog', () => {
  it('should be able to create a new task audit log', () => {
    const taskId = UniqueId.create();
    const userId = UniqueId.create();
    const auditLog = TaskAuditLog.create({
      taskId,
      userId,
      action: TaskAuditAction.CREATED,
      changes: { changes: [] },
    });

    expect(auditLog).toBeDefined();
    expect(auditLog.taskId.value).toBe(taskId.value);
    expect(auditLog.userId.value).toBe(userId.value);
    expect(auditLog.action).toBe(TaskAuditAction.CREATED);
  });

  it('should be able to create audit log with changes', () => {
    const taskId = UniqueId.create();
    const userId = UniqueId.create();
    const auditLog = TaskAuditLog.create({
      taskId,
      userId,
      action: TaskAuditAction.STATUS_CHANGED,
      changes: {
        changes: [
          { field: 'status', oldValue: 'TODO', newValue: 'IN_PROGRESS' },
        ],
      },
    });

    expect(auditLog.changes.changes).toHaveLength(1);
    expect(auditLog.changes.changes[0].field).toBe('status');
  });
});
