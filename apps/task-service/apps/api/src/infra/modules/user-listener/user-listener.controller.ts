import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserReadModelRepository } from '@core/domain/ports';
import { UniqueId } from '@core/domain/value-objects/unique-id';

@Controller()
export class UserListener {
  constructor(
    private readonly userReadModelRepository: UserReadModelRepository,
  ) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() payload: any) {
    await this.userReadModelRepository.save({
      id: UniqueId.create(payload.id),
      email: payload.email,
      name: payload.email,
      createdAt: payload.createdAt
    });
  }
}
