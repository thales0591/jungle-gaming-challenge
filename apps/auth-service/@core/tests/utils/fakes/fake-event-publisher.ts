import { EventPublisher } from '@core/application/ports/event-publisher';

interface PublishedEvent {
  pattern: string;
  payload: any;
}

export class FakeEventPublisher implements EventPublisher {
  public events: PublishedEvent[] = [];

  async emit(pattern: string, payload: any): Promise<void> {
    this.events.push({ pattern, payload });
  }

  findEvent(pattern: string): PublishedEvent | undefined {
    return this.events.find((event) => event.pattern === pattern);
  }

  clear(): void {
    this.events = [];
  }
}
