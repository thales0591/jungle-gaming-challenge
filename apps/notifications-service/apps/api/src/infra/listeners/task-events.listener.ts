import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from '../websocket/notifications.gateway';

@Controller()
export class TaskEventsListener {
  private readonly logger = new Logger(TaskEventsListener.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @EventPattern('task.created')
  async handleTaskCreated(@Payload() payload: any) {
    this.logger.log(`Received task.created event: ${JSON.stringify(payload)}`);

    const eventData = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate,
      authorId: payload.authorId,
      assignedUserIds: payload.assignedUserIds,
      createdAt: payload.createdAt,
    };

    const usersToNotify = new Set<string>();
    usersToNotify.add(payload.authorId);
    payload.assignedUserIds?.forEach((userId: string) =>
      usersToNotify.add(userId),
    );

    const userIds = Array.from(usersToNotify);
    this.logger.log(`Notifying users: ${userIds.join(', ')}`);

    this.notificationsGateway.emitToUsers(userIds, 'task:created', eventData);
  }

  @EventPattern('task.updated')
  async handleTaskUpdated(@Payload() payload: any) {
    this.logger.log(`Received task.updated event: ${JSON.stringify(payload)}`);

    const eventData = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate,
      authorId: payload.authorId,
      assignedUserIds: payload.assignedUserIds,
      updatedAt: payload.updatedAt,
    };

    const usersToNotify = new Set<string>();
    usersToNotify.add(payload.authorId);
    payload.assignedUserIds?.forEach((userId: string) =>
      usersToNotify.add(userId),
    );

    const userIds = Array.from(usersToNotify);
    this.logger.log(`Notifying users: ${userIds.join(', ')}`);

    this.notificationsGateway.emitToUsers(userIds, 'task:updated', eventData);
  }

  @EventPattern('comment.new')
  async handleCommentNew(@Payload() payload: any) {
    this.logger.log(`Received comment.new event: ${JSON.stringify(payload)}`);

    const eventData = {
      id: payload.id,
      taskId: payload.taskId,
      taskTitle: payload.taskTitle,
      user: payload.user,
      content: payload.content,
      createdAt: payload.createdAt,
    };

    const usersToNotify = new Set<string>();
    usersToNotify.add(payload.taskAuthorId);
    usersToNotify.add(payload.authorId);
    payload.taskAssignedUserIds?.forEach((userId: string) =>
      usersToNotify.add(userId),
    );

    const userIds = Array.from(usersToNotify);
    this.logger.log(`Notifying users: ${userIds.join(', ')}`);

    this.notificationsGateway.emitToUsers(userIds, 'comment:new', eventData);
  }
}
