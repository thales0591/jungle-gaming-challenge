import { EventPublisher } from '@core/application/ports/event-publisher';

export class FakeEventPublisher implements EventPublisher {
  public events: Array<{ pattern: string; payload: any }> = [];

  async emit(pattern: string, payload: any): Promise<void> {
    this.events.push({ pattern, payload });
  }

  findEvent(pattern: string) {
    return this.events.find((event) => event.pattern === pattern);
  }

  clear() {
    this.events = [];
  }
}
