import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { Request } from 'express';

@Injectable()
export class TasksProxyService {
  private readonly logger = new Logger(TasksProxyService.name);
  private readonly baseUrl =
    process.env.TASKS_SERVICE_URL;

  async forward(req: Request) {
    try {
      const url = `${this.baseUrl}${req.originalUrl.replace('/api', '')}`;

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
      });

      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        this.logger.error(`Error forwarding request: ${axiosError.message}`);
        return {
          status: axiosError.response?.status || 500,
          data: axiosError.response?.data || {
            message: 'Internal server error',
          },
        };
      }
      this.logger.error(`Unexpected error: ${error}`);
      throw error;
    }
  }
}
