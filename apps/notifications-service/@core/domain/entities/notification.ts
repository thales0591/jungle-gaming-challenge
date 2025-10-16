import { StringValidator } from '../validators/strings-validator';
import { UniqueId } from '../value-objects/unique-id';
import { AggregateRoot } from './aggregate-root';

export interface NotificationProps {
  userId: UniqueId;
  content: string;
  haveBeenRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Notification extends AggregateRoot<NotificationProps> {
  private constructor(props: NotificationProps, id?: UniqueId) {
    super(props, id);
    this.validate();
  }

  static create(
    props: Omit<NotificationProps, 'createdAt'> & { createdAt?: Date },
    id?: UniqueId,
  ): Notification {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get userId(): UniqueId {
    return this.props.userId;
  }

  get content(): string {
    return this.props.content;
  }

  get haveBeenRead(): boolean {
    return this.props.haveBeenRead;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  markAsRead(): void {
    this.props.haveBeenRead = true;
    this.touch();
  }

  markAsUnread(): void {
    this.props.haveBeenRead = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  protected validate(): void {
    StringValidator.isNotEmptyOrThrows('content', this.props.content);

    if (typeof this.props.haveBeenRead !== 'boolean') {
      throw new Error('haveBeenRead must be a boolean');
    }
  }
}
