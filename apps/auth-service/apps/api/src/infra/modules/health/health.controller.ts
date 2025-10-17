import {
  Controller,
  Get,
  HttpException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmService } from '../../ioc/database/typeorm.service';
import { HealthCheckResponse, HealthCheckStatus } from './health.response';

@Injectable()
@Controller('health')
export class HealthController {
  private static readonly DATABASE_COMPONENT = 'database';

  constructor(
    private readonly typeOrm: TypeOrmService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async isHealthy(): Promise<HealthCheckResponse> {
    const healthCheck = new HealthCheckResponse();

    healthCheck.addComponent({
      name: HealthController.DATABASE_COMPONENT,
      status: await this.isDatabaseHealthy(),
    });

    if (healthCheck.isHealthy()) {
      return healthCheck;
    }
    throw new HttpException(
      'Service unavailable',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  private async isDatabaseHealthy(): Promise<HealthCheckStatus> {
    try {
      await this.typeOrm.query('SELECT 1');
      return 'up';
    } catch {
      return 'down';
    }
  }
}
