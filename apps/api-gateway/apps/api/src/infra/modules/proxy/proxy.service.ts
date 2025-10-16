import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  async forward(req: Request, targetServiceUrl: string) {
    const path = req.originalUrl.replace('/api', '').split('?')[0];
    const url = `${targetServiceUrl}${path}`;

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
