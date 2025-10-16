import { Controller, All, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy/proxy.service';
import { Public } from '../decorators/public.decorator';

@Controller()
export class GatewayController {
  private readonly authServiceUrl: string;
  private readonly tasksServiceUrl: string;
  private readonly notificationsServiceUrl: string;

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
    this.tasksServiceUrl = this.configService.getOrThrow<string>('TASKS_SERVICE_URL');
    this.notificationsServiceUrl = this.configService.getOrThrow<string>('NOTIFICATIONS_SERVICE_URL');
  }

  @All('task')
  async handleRootTasks(@Req() req, @Res() res) {
    const result = await this.proxyService.forward(req, this.tasksServiceUrl);
    return res.status(result.status).send(result.data);
  }

  @All('task/*path')
  async handleTasks(@Req() req, @Res() res) {
    const result = await this.proxyService.forward(req, this.tasksServiceUrl);
    return res.status(result.status).send(result.data);
  }

  @All('users/*path')
  async handleUsers(@Req() req, @Res() res) {
    const result = await this.proxyService.forward(req, this.authServiceUrl);
    return res.status(result.status).send(result.data);
  }

  @Public()
  @All('auth/*path')
  async handleAuth(@Req() req, @Res() res) {
    const result = await this.proxyService.forward(req, this.authServiceUrl);
    return res.status(result.status).send(result.data);
  }

  @All('notifications')
  async handleRootNotifications(@Req() req, @Res() res) {
    const result = await this.proxyService.forward(req, this.notificationsServiceUrl);
    return res.status(result.status).send(result.data);
  }

  @All('notifications/*path')
  async handleNotifications(@Req() req, @Res() res) {
    const result = await this.proxyService.forward(req, this.notificationsServiceUrl);
    return res.status(result.status).send(result.data);
  }
}
