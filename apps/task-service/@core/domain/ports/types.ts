import { Task } from "@core/domain/entities/task";

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