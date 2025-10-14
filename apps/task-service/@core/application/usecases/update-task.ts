import { Task } from '@core/domain/entities/task';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotFoundException } from '@core/domain/exceptions/not-found-exception';
import { TaskRepository } from '@core/domain/ports/task-repository';
import { TaskPriority, TaskStatus } from '@core/domain/entities/task';
import { EventPublisher } from '../ports/event-publisher';
import { TaskAuditLogRepository } from '@core/domain/ports/task-audit-log-repository';
import { TaskAuditLog } from '@core/domain/entities/task-audit-log';

export interface UpdateTaskProps {
  id: UniqueId;
  authorId?: UniqueId;
  title?: string;
  description?: string;
  dueDate?: Date | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedUserIds?: UniqueId[];
}

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly taskAuditLogRepository: TaskAuditLogRepository,
  ) {}

  async execute({
    id,
    authorId,
    title,
    description,
    dueDate,
    priority,
    status,
    assignedUserIds,
  }: UpdateTaskProps): Promise<Task> {
    const richTask = await this.taskRepository.findById(id);
    if (!richTask) throw new NotFoundException('Task not found');

    const task = richTask.task;

    const oldValues = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignedUserIds: task.assignedUserIds.map(id => id.toString()),
    };

    task.update({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedUserIds,
      authorId,
    });

    await this.taskRepository.update(task);

    const userId = authorId || task.authorId;

    if (status && status !== oldValues.status) {
      const auditLog = TaskAuditLog.create({
        taskId: task.id,
        userId,
        action: 'STATUS_CHANGED',
        changes: {
          changes: [{
            field: 'status',
            oldValue: oldValues.status,
            newValue: status,
          }],
        },
      });
      await this.taskAuditLogRepository.create(auditLog);
    }

    if (priority && priority !== oldValues.priority) {
      const auditLog = TaskAuditLog.create({
        taskId: task.id,
        userId,
        action: 'PRIORITY_CHANGED',
        changes: {
          changes: [{
            field: 'priority',
            oldValue: oldValues.priority,
            newValue: priority,
          }],
        },
      });
      await this.taskAuditLogRepository.create(auditLog);
    }

    if (dueDate !== undefined) {
      const oldDate: string | null = oldValues.dueDate ? new Date(oldValues.dueDate).toISOString() : null;
      const newDate: string | null = dueDate ? new Date(dueDate).toISOString() : null;
      if (oldDate !== newDate) {
        const auditLog = TaskAuditLog.create({
          taskId: task.id,
          userId,
          action: 'DUE_DATE_CHANGED',
          changes: {
            changes: [{
              field: 'dueDate',
              oldValue: oldDate,
              newValue: newDate,
            }],
          },
        });
        await this.taskAuditLogRepository.create(auditLog);
      }
    }

    if (assignedUserIds !== undefined) {
      const newAssignedIds = assignedUserIds.map(id => id.toString()).sort();
      const oldAssignedIds = oldValues.assignedUserIds.sort();

      const addedUsers = newAssignedIds.filter(id => !oldAssignedIds.includes(id));
      if (addedUsers.length > 0) {
        const auditLog = TaskAuditLog.create({
          taskId: task.id,
          userId,
          action: 'ASSIGNED_USER_ADDED',
          changes: {
            changes: [{
              field: 'assignedUserIds',
              oldValue: oldAssignedIds.join(',') || null,
              newValue: addedUsers.join(','),
            }],
          },
        });
        await this.taskAuditLogRepository.create(auditLog);
      }

      const removedUsers = oldAssignedIds.filter(id => !newAssignedIds.includes(id));
      if (removedUsers.length > 0) {
        const auditLog = TaskAuditLog.create({
          taskId: task.id,
          userId,
          action: 'ASSIGNED_USER_REMOVED',
          changes: {
            changes: [{
              field: 'assignedUserIds',
              oldValue: removedUsers.join(','),
              newValue: newAssignedIds.join(',') || null,
            }],
          },
        });
        await this.taskAuditLogRepository.create(auditLog);
      }
    }

    const generalChanges: { field: string; oldValue: string | null; newValue: string | null }[] = [];

    if (title && title !== oldValues.title) {
      generalChanges.push({ field: 'title', oldValue: oldValues.title, newValue: title });
    }

    if (description && description !== oldValues.description) {
      generalChanges.push({ field: 'description', oldValue: oldValues.description, newValue: description });
    }

    if (generalChanges.length > 0) {
      const auditLog = TaskAuditLog.create({
        taskId: task.id,
        userId,
        action: 'UPDATED',
        changes: {
          changes: generalChanges,
        },
      });
      await this.taskAuditLogRepository.create(auditLog);
    }

    await this.eventPublisher.emit('task.updated', {
      id: task.id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      authorId: task.authorId.toString(),
      assignedUserIds: task.assignedUserIds.map((id) => id.toString()),
      updatedAt: task.updatedAt,
    });

    return task;
  }
}
