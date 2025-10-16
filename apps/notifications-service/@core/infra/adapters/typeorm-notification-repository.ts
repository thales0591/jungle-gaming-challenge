import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { Notification } from '@core/domain/entities/notification';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { NotificationRepository } from '@core/domain/ports/notification-repository';
import { ITypeOrm } from '../typeorm-client';

export class TypeOrmNotificationRepository extends NotificationRepository {
  private repository: Repository<NotificationEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(NotificationEntity);
  }

  async create(notification: Notification): Promise<void> {
    await this.repository.save({
      id: notification.id.value,
      userId: notification.userId.value,
      content: notification.content,
      haveBeenRead: notification.haveBeenRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt ?? new Date(),
    });
  }

  async findById(id: UniqueId): Promise<Notification | null> {
    const entity = await this.repository.findOne({
      where: { id: id.value },
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(
    userId: UniqueId,
    page: number,
    size: number,
  ): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { userId: userId.value },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async markAsRead(id: UniqueId): Promise<void> {
    await this.repository.update(
      { id: id.value },
      { haveBeenRead: true, updatedAt: new Date() },
    );
  }

  async markAllAsRead(userId: UniqueId): Promise<void> {
    await this.repository.update(
      { userId: userId.value, haveBeenRead: false },
      { haveBeenRead: true, updatedAt: new Date() },
    );
  }

  async countUnreadByUserId(userId: UniqueId): Promise<number> {
    return await this.repository.count({
      where: { userId: userId.value, haveBeenRead: false },
    });
  }

  async delete(id: UniqueId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private toDomain(entity: NotificationEntity): Notification {
    return Notification.create(
      {
        userId: UniqueId.create(entity.userId),
        content: entity.content,
        haveBeenRead: entity.haveBeenRead,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
      new UniqueId(entity.id),
    );
  }
}
