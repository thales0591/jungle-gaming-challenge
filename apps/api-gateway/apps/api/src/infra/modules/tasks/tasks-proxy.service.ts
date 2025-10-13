import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request } from 'express';

@Injectable()
export class TasksProxyService {
  private readonly logger = new Logger(TasksProxyService.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.getOrThrow<string>('TASKS_SERVICE_URL');
  }

  async forward(req: Request) {
    const path = req.originalUrl.replace('/api', '').split('?')[0];
    const url = `${this.baseUrl}${path}`;

    this.logger.log(`Forwarding ${req.method} ${url}`);

    const headers: Record<string, any> = {
      'Content-Type': 'application/json',
    };

    if (req.user) {
      headers['x-user-id'] = req.user.userId;
    }

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers,
      params: req.query,
      validateStatus: () => true,
    });

    return {
      status: response.status,
      data: response.data,
    };
  }
}
