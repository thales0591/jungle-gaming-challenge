import { AggregateRoot } from './aggregate-root';
import { UniqueId } from '../value-objects/unique-id';
import { DomainException } from '../exceptions/domain-exception';
import { StringValidator } from '../validators/strings-validator';

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface TaskProps {
  authorId: UniqueId;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUserIds: UniqueId[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Task extends AggregateRoot<TaskProps> {
  private constructor(props: TaskProps, id?: UniqueId) {
    super(props, id);
    this.validate();
  }

  static create(
    props: Omit<TaskProps, 'createdAt'> & { createdAt?: Date },
    id?: UniqueId,
  ): Task {
    return new Task(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get authorId(): UniqueId {
    return this.props.authorId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get dueDate(): Date | null {
    return this.props.dueDate;
  }

  get priority(): TaskPriority {
    return this.props.priority;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get assignedUserIds(): UniqueId[] {
    return this.props.assignedUserIds;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  setAuthorId(authorId: UniqueId) {
    this.props.authorId = authorId;
    this.touch();
  }

  setTitle(title: string) {
    StringValidator.isNotEmptyOrThrows('title', title);
    this.props.title = title;
    this.touch();
  }

  setDescription(description: string) {
    StringValidator.isNotEmptyOrThrows('description', description);
    this.props.description = description;
    this.touch();
  }

  setDueDate(date: Date | null) {
    if (date !== null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(date);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        throw new DomainException(
          'Due date cannot be in the past. Please select today or a future date.',
        );
      }
    }
    this.props.dueDate = date;
    this.touch();
  }

  setPriority(priority: TaskPriority) {
    const allowed = Object.values(TaskPriority);
    if (!allowed.includes(priority))
      throw new DomainException(`Invalid priority: ${priority}`);
    this.props.priority = priority;
    this.touch();
  }

  setStatus(status: TaskStatus) {
    const allowed = Object.values(TaskStatus);
    if (!allowed.includes(status))
      throw new DomainException(`Invalid status: ${status}`);
    this.props.status = status;
    this.touch();
  }

  update(fields: Partial<Omit<TaskProps, 'createdAt' | 'updatedAt'>>) {
    if (fields.title) this.setTitle(fields.title);
    if (fields.description) this.setDescription(fields.description);
    if (fields.dueDate !== undefined) this.setDueDate(fields.dueDate);
    if (fields.priority) this.setPriority(fields.priority);
    if (fields.status) this.setStatus(fields.status);
    if (fields.authorId) this.setAuthorId(fields.authorId);
    if (fields.assignedUserIds !== undefined) {
      this.props.assignedUserIds = fields.assignedUserIds;
    }
    this.touch();
  }

  assignUser(userId: UniqueId) {
    const already = this.props.assignedUserIds.find(
      (id) => id.toString() === userId.toString(),
    );
    if (!already) {
      this.props.assignedUserIds.push(userId);
      this.touch();
    }
  }

  unassignUser(userId: UniqueId) {
    this.props.assignedUserIds = this.props.assignedUserIds.filter(
      (id) => id.toString() !== userId.toString(),
    );
    this.touch();
  }

  markAs(status: TaskStatus) {
    this.setStatus(status);
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  protected validate() {
    StringValidator.isNotEmptyOrThrows('title', this.props.title);
    StringValidator.isNotEmptyOrThrows('description', this.props.description);

    if (!Object.values(TaskPriority).includes(this.props.priority))
      throw new DomainException(`Invalid priority: ${this.props.priority}`);

    if (!Object.values(TaskStatus).includes(this.props.status))
      throw new DomainException(`Invalid status: ${this.props.status}`);
  }
}
