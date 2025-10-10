import { Task } from '../entities/task';
import { UniqueId } from '../value-objects/unique-id';

export abstract class TaskRepository {
  abstract save(entity: Task): Promise<void>;
  abstract create(entity: Task): Promise<void>;
  abstract findMany(page: number, size: number): Promise<Task[]>;
  abstract findById(id: UniqueId): Promise<Task | null>;
  abstract update(entity: Task): Promise<void>;
  abstract delete(id: UniqueId): Promise<void>;
}
