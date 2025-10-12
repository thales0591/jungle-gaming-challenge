export abstract class EventPublisher {
  abstract emit(pattern: string, payload: any): Promise<void>;
}
