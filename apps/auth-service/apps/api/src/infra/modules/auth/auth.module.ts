import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UseCasesModule } from '../../ioc/usecases/usecases.module';

@Module({
  imports: [UseCasesModule],
  controllers: [AuthController],
})
export class AuthModule {}
