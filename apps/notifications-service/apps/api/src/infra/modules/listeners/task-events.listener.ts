import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from '../../websocket/notifications.gateway';
import { CreateNotificationUseCase } from '@core/application/usecases';
import { UniqueId } from '@core/domain/value-objects/unique-id';

@Controller()
export class TaskEventsListener {
  private readonly logger = new Logger(TaskEventsListener.name);

  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly createNotificationUseCase: CreateNotificationUseCase,
  ) {}

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
    payload.assignedUserIds?.forEach((userId: string) => {
      if (userId !== payload.authorId) {
        usersToNotify.add(userId);
      }
    });

    const userIds = Array.from(usersToNotify);
    this.logger.log(`Notifying users: ${userIds.join(', ')}`);

    await Promise.all(
      userIds.map((userId) =>
        this.createNotificationUseCase.execute({
          userId: UniqueId.create(userId),
          content: `Nova tarefa criada: ${payload.title}`,
        }),
      ),
    );

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
      updatedBy: payload.updatedBy,
    };

    const usersToNotify = new Set<string>();
    if (payload.authorId !== payload.updatedBy) {
      usersToNotify.add(payload.authorId);
    }

    payload.assignedUserIds?.forEach((userId: string) => {
      if (userId !== payload.updatedBy) {
        usersToNotify.add(userId);
      }
    });

    const userIds = Array.from(usersToNotify);
    this.logger.log(`Notifying users: ${userIds.join(', ')}`);

    await Promise.all(
      userIds.map((userId) =>
        this.createNotificationUseCase.execute({
          userId: UniqueId.create(userId),
          content: `Tarefa atualizada: ${payload.title}`,
        }),
      ),
    );

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

    if (payload.taskAuthorId !== payload.authorId) {
      usersToNotify.add(payload.taskAuthorId);
    }

    payload.assignedUserIds?.forEach((userId: string) => {
      if (userId !== payload.authorId) {
        usersToNotify.add(userId);
      }
    });

    const userIds = Array.from(usersToNotify);
    this.logger.log(`Notifying users: ${userIds.join(', ')}`);

    await Promise.all(
      userIds.map((userId) =>
        this.createNotificationUseCase.execute({
          userId: UniqueId.create(userId),
          content: `Novo comentário de ${payload.user.name} em "${payload.taskTitle}"`,
        }),
      ),
    );

    this.notificationsGateway.emitToUsers(userIds, 'comment:new', eventData);
  }
}
