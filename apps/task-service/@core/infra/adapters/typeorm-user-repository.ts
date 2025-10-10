import { Repository } from 'typeorm';
import { UserReadModel } from '@core/domain/entities/user-read-model';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { UserReadModelRepository } from '@core/domain/ports';
import { ITypeOrm } from '../typeorm-client';
import { UserReadModelEntity } from '../entities/user-read-model.entity';

export class TypeOrmUserReadModelRepository extends UserReadModelRepository {
  private repository: Repository<UserReadModelEntity>;

  constructor(private readonly orm: ITypeOrm) {
    super();
    this.repository = this.orm.dataSource.getRepository(UserReadModelEntity);
  }

  async findById(id: UniqueId): Promise<UserReadModel | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return this.toDomain(entity);
  }

  async save(user: UserReadModel): Promise<void> {
    await this.repository.insert({
      id: user.id.value,
      email: user.email,
      username: user.name,
      createdAt: user.createdAt,
    });
  }

  private toDomain(user: UserReadModelEntity | null): UserReadModel | null {
    if (!user) return null;
    const { id, email, username, createdAt } = user;

    return new UserReadModel(
      new UniqueId(id),
      email,
      username,
      createdAt,
    );
  }
}
