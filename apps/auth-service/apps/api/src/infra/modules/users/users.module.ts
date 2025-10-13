import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UseCasesModule } from '../../ioc/usecases/usecases.module';

@Module({
  imports: [UseCasesModule],
  controllers: [UsersController],
})
export class UsersModule {}
