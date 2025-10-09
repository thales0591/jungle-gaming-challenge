import { UniqueId } from "../value-objects/unique-id"

export abstract class Entity<Props> {
  private _id: UniqueId
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueId) {
    this.props = props
    this._id = id ?? new UniqueId()
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
