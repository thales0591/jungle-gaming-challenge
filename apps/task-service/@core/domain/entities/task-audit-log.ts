import { Entity } from './entity';
import { UniqueId } from '../value-objects/unique-id';

export const TaskAuditAction = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PRIORITY_CHANGED: 'PRIORITY_CHANGED',
  ASSIGNED_USER_ADDED: 'ASSIGNED_USER_ADDED',
  ASSIGNED_USER_REMOVED: 'ASSIGNED_USER_REMOVED',
  DUE_DATE_CHANGED: 'DUE_DATE_CHANGED',
} as const;
export type TaskAuditAction =
  (typeof TaskAuditAction)[keyof typeof TaskAuditAction];

export interface AuditLogChange {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface AuditLogChanges {
  changes: AuditLogChange[];
}

export interface TaskAuditLogProps {
  taskId: UniqueId;
  userId: UniqueId;
  action: TaskAuditAction;
  changes: AuditLogChanges;
  createdAt?: Date | null;
}

export class TaskAuditLog extends Entity<TaskAuditLogProps> {
  private constructor(props: TaskAuditLogProps, id?: UniqueId) {
    super(props, id);
    this.props.createdAt = props.createdAt ?? new Date();
  }

  static create(props: TaskAuditLogProps, id?: UniqueId): TaskAuditLog {
    return new TaskAuditLog(props, id);
  }

  get taskId() {
    return this.props.taskId;
  }

  get userId() {
    return this.props.userId;
  }

  get action() {
    return this.props.action;
  }

  get changes() {
    return this.props.changes;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
