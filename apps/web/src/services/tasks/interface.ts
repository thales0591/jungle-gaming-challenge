export interface UserReadModel {
  id: string;
  name: string;
  email: string;
}

export interface RichTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUsers: UserReadModel[];
  author: UserReadModel;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUserIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type TaskSortBy = "newest" | "oldest" | "due-date" | "priority";

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUserIds: string[];
}

export interface FetchTasksRequestData {
  size: number;
  page: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortBy;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorName: string;
  authorEmail: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: "task_created" | "task_updated" | "comment_new" | "task_assigned";
  title: string;
  message: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}

export type TaskAuditAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNED_USER_ADDED"
  | "ASSIGNED_USER_REMOVED"
  | "DUE_DATE_CHANGED";

export interface Change {
  field: string;
  newValue: string | null;
  oldValue: string | null;
}

export interface AuditLogChanges {
  changes: Change[];
}

export interface TaskAuditLog {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: TaskAuditAction;
  changes: AuditLogChanges;
  createdAt: string;
}
