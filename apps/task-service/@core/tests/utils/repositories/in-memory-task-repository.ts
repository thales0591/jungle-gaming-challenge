import { TaskRepository } from '@core/domain/ports/task-repository';
import { Task, TaskStatus, TaskPriority } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { DomainTaskWithUsers, TaskFilters } from '@core/domain/ports/types';
import { UserReadModel } from '@core/domain/entities/user-read-model';

export class InMemoryTaskRepository extends TaskRepository {
  public items: Task[] = [];
  public users: Map<string, UserReadModel> = new Map();

  async create(entity: Task): Promise<void> {
    this.items.push(entity);
  }

  async findManyWithUsers(
    userId: string,
    page: number,
    size: number,
    filters?: TaskFilters,
  ): Promise<DomainTaskWithUsers[]> {
    let filtered = this.items.filter(
      (task) =>
        task.authorId.value === userId ||
        task.assignedUserIds.some((id) => id.value === userId),
    );

    if (filters?.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (filters?.priority) {
      filtered = filtered.filter(
        (task) => task.priority === filters.priority,
      );
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          break;
        case 'oldest':
          filtered.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
          );
          break;
        case 'due-date':
          filtered.sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.getTime() - b.dueDate.getTime();
          });
          break;
        case 'priority':
          const priorityOrder = {
            [TaskPriority.URGENT]: 4,
            [TaskPriority.HIGH]: 3,
            [TaskPriority.MEDIUM]: 2,
            [TaskPriority.LOW]: 1,
          };
          filtered.sort(
            (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
          );
          break;
      }
    }

    const start = (page - 1) * size;
    const paginated = filtered.slice(start, start + size);

    return paginated.map((task) => {
      const author = this.users.get(task.authorId.value);
      const assignedUsers = task.assignedUserIds
        .map((id) => this.users.get(id.value))
        .filter((u) => u !== undefined) as UserReadModel[];

      return {
        task,
        author: {
          id: author?.id.value || '',
          name: author?.name || '',
          email: author?.email || '',
        },
        assignedUsers: assignedUsers.map((u) => ({
          id: u.id.value,
          name: u.name,
          email: u.email,
        })),
      };
    });
  }

  async findById(id: UniqueId): Promise<DomainTaskWithUsers | null> {
    const task = this.items.find((item) => item.id.value === id.value);
    if (!task) return null;

    const author = this.users.get(task.authorId.value);
    const assignedUsers = task.assignedUserIds
      .map((id) => this.users.get(id.value))
      .filter((u) => u !== undefined) as UserReadModel[];

    return {
      task,
      author: {
        id: author?.id.value || '',
        name: author?.name || '',
        email: author?.email || '',
      },
      assignedUsers: assignedUsers.map((u) => ({
        id: u.id.value,
        name: u.name,
        email: u.email,
      })),
    };
  }

  async update(entity: Task): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === entity.id.value,
    );
    if (index >= 0) {
      this.items[index] = entity;
    }
  }

  async delete(id: UniqueId): Promise<void> {
    this.items = this.items.filter((item) => item.id.value !== id.value);
  }

  addUser(user: UserReadModel): void {
    this.users.set(user.id.value, user);
  }
}
