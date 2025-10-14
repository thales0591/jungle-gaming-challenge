import { Task, TaskPriority, TaskStatus } from '@core/domain/entities/task';
import { TaskComment } from '@core/domain/entities/task-comment';
import { TaskAuditLog } from '@core/domain/entities/task-audit-log';

export interface DomainTaskWithUsers {
  task: Task;
  author: {
    id: string;
    name: string;
    email: string;
  };
  assignedUsers: {
    id: string;
    name: string;
    email: string;
  }[];
}

export interface TaskCommentWithAuthor {
  comment: TaskComment;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TaskAuditLogWithUser {
  auditLog: TaskAuditLog;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type TaskSortBy = 'newest' | 'oldest' | 'due-date' | 'priority';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortBy;
}
