export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
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
  size: number,
  page: number
}
