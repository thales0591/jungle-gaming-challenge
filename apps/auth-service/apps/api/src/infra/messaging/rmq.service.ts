import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(
    @Inject('RABBITMQ_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async emit(pattern: string, payload: any) {
    console.log('no emit');
    await this.client.connect();
    return this.client.emit(pattern, payload);
  }

  async send<TResult, TInput>(pattern: string, data: TInput) {
    return this.client.send<TResult, TInput>(pattern, data);
  }
}
