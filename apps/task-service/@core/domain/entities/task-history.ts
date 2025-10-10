import { Entity } from './entity'
import { UniqueId } from '../value-objects/unique-id'

export interface TaskHistoryProps {
  action: string
  performedBy: UniqueId
  timestamp?: Date
}

export class TaskHistory extends Entity<TaskHistoryProps> {
  private constructor(props: TaskHistoryProps, id?: UniqueId) {
    super(props, id)
    this.props.timestamp = props.timestamp ?? new Date()
  }

  static create(props: TaskHistoryProps, id?: UniqueId): TaskHistory {
    return new TaskHistory(props, id)
  }

  get action(): string {
    return this.props.action
  }

  get performedBy(): UniqueId {
    return this.props.performedBy
  }

  get timestamp(): Date {
    return this.props.timestamp!
  }
}
