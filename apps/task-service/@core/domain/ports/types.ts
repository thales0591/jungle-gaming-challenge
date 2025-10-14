import { Task } from "@core/domain/entities/task";
import { TaskComment } from "@core/domain/entities/task-comment";

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