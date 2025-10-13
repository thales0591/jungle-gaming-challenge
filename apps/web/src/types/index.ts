export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedUsers: User[]
  createdAt: string
  updatedAt: string
  commentCount: number
}

export interface Comment {
  id: string
  taskId: string
  userId: string
  user: User
  content: string
  createdAt: string
}

export interface Notification {
  id: string
  type: "task_created" | "task_updated" | "comment_new" | "task_assigned"
  title: string
  message: string
  taskId?: string
  read: boolean
  createdAt: string
}

export interface TaskHistory {
  id: string
  taskId: string
  userId: string
  user: User
  action: string
  changes: Record<string, any>
  createdAt: string
}
