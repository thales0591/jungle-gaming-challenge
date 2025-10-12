import { Controller, All, Req, Res } from '@nestjs/common';
import { TasksProxyService } from './tasks/tasks-proxy.service';
import { AuthProxyService } from './auth/auth-proxy.service';
import { Public } from '../decorators/public.decorator';

@Controller()
export class GatewayController {
  constructor(
    private readonly tasksProxy: TasksProxyService,
    private readonly authProxy: AuthProxyService,
  ) {}

  @All('task')
  @All('task/*path')
  async handleTasks(@Req() req, @Res() res) {
    const result = await this.tasksProxy.forward(req);
    return res.status(result.status).send(result.data);
  }

  @Public()
  @All('auth/*path')
  async handleAuth(@Req() req, @Res() res) {
    const result = await this.authProxy.forward(req);
    return res.status(result.status).send(result.data);
  }
}
