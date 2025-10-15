import { Injectable, Logger } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { EventPublisher } from '@core/application/ports/event-publisher';

@Injectable()
export class EventPublisherAdapter extends EventPublisher {
  constructor(private readonly rmqService: RmqService) {
    super();
  }

  async emit(pattern: string, payload: any): Promise<void> {
    await this.rmqService.emit(pattern, payload);
  }
}
