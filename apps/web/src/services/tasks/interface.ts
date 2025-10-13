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

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUserIds: string[];
}

export interface FetchTasksRequestData {
  size: number;
  page: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
