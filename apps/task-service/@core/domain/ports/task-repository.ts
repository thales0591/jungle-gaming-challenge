import { Task } from '../entities/task';
import { UniqueId } from '../value-objects/unique-id';
import { DomainTaskWithUsers } from './types';

export abstract class TaskRepository {
  abstract create(entity: Task): Promise<void>;
  abstract findManyWithUsers(userId: string, page: number, size: number): Promise<DomainTaskWithUsers[]>;
  abstract findById(id: UniqueId): Promise<DomainTaskWithUsers | null>;
  abstract update(entity: Task): Promise<void>;
  abstract delete(id: UniqueId): Promise<void>;
}
