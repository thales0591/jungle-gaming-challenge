import { Repository } from 'typeorm';
import { UserRepository } from '@core/domain/ports/user-repository';
import { User as DomainUser } from '@core/domain/entities/user';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { UserEntity as TypeOrmUser } from '../entities/user.entity';
import { TypeOrmService } from 'apps/api/src/infra/ioc/database/typeorm.service';

export class TypeOrmUserRepository extends UserRepository {
  private repository: Repository<TypeOrmUser>;

  constructor(private readonly dataSource: TypeOrmService) {
    super();
    this.repository = this.dataSource.getRepository(TypeOrmUser);
  }

  async save(entity: DomainUser): Promise<void> {
    const user = this.repository.create({
      id: entity.id.value,
      name: entity.name,
      email: entity.email,
      password: entity.hashedPassword,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
    await this.repository.save(user);
  }

  async update(entity: DomainUser): Promise<void> {
    await this.repository.update(entity.id.value, {
      name: entity.name,
      email: entity.email,
      password: entity.hashedPassword,
      updatedAt: new Date(),
    });
  }

  async delete(id: UniqueId): Promise<void> {
    await this.repository.delete(id.value);
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { email } });
    return this.userToDomain(user);
  }

  async findById(id: UniqueId): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { id: id.value } });
    return this.userToDomain(user);
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.repository.update(userId, { refreshToken });
  }

  async findByRefreshToken(token: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({
      where: { refreshToken: token },
    });
    return this.userToDomain(user);
  }

  private userToDomain(user: TypeOrmUser | null): DomainUser | null {
    if (!user) return null;

    const { id, name, email, password, createdAt, updatedAt } = user;

    return DomainUser.create(
      {
        name,
        email,
        password,
        createdAt,
        updatedAt,
      },
      new UniqueId(id),
    );
  }
}
