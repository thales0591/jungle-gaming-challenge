import {
  Controller,
  Get,
  HttpException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../decorators/public.decorator';
import { HealthCheckResponse, HealthCheckStatus } from './health.response';

@Injectable()
@Controller('health')
export class HealthController {
  private static readonly API_GATEWAY_COMPONENT = 'api-gateway';

  constructor(private readonly configService: ConfigService) {}

  @Get()
  @Public()
  async isHealthy(): Promise<HealthCheckResponse> {
    const healthCheck = new HealthCheckResponse();

    healthCheck.addComponent({
      name: HealthController.API_GATEWAY_COMPONENT,
      status: this.isGatewayHealthy(),
    });

    if (healthCheck.isHealthy()) {
      return healthCheck;
    }
    throw new HttpException(
      'Service unavailable',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  private isGatewayHealthy(): HealthCheckStatus {
    return 'up';
  }
}
