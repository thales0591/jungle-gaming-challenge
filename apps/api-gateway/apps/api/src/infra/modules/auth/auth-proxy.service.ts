import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { Request } from 'express';

@Injectable()
export class AuthProxyService {
  private readonly logger = new Logger(AuthProxyService.name);
  private readonly baseUrl =
    process.env.AUTH_SERVICE_URL;

  async forward(req: Request) {
    try {
      const path = req.originalUrl.replace('/api', '').split('?')[0];
      const url = `${this.baseUrl}${path}`;

      this.logger.log(`Forwarding ${req.method} ${url}`);

      const response = await axios({
        method: req.method,
        url,
        data: req.body,
        headers: {
          'Content-Type': 'application/json',
        },
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
