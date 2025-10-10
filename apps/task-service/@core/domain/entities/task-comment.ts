import { Entity } from './entity'
import { UniqueId } from '../value-objects/unique-id'
import { StringValidator } from '../validators/strings-validator'

export interface TaskCommentProps {
  taskId: UniqueId
  authorId: UniqueId
  content: string
  createdAt?: Date | null
}

export class TaskComment extends Entity<TaskCommentProps> {
  private constructor(props: TaskCommentProps, id?: UniqueId) {
    super(props, id)
    this.props.createdAt = props.createdAt ?? new Date()
    this.validate()
  }

  static create(props: TaskCommentProps, id?: UniqueId): TaskComment {
    return new TaskComment(props, id)
  }

  get taskId() {
    return this.props.taskId
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  updateContent(newContent: string): void {
    StringValidator.isNotEmptyOrThrows('content', newContent)
    this.props.content = newContent
  }

  protected validate(): void {
    StringValidator.isNotEmptyOrThrows('content', this.props.content)
  }
}
