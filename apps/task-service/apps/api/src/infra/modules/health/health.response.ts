export type HealthCheckStatus = 'up' | 'down';

export class HealthCheckComponent {
  name: string;
  status: HealthCheckStatus;
}

export class HealthCheckResponse {
  constructor(
    public status: HealthCheckStatus = 'up',
    public components: HealthCheckComponent[] = [],
  ) {}

  addComponent({ status, name }: HealthCheckComponent) {
    const existentComponent = this.components.find(
      (component) => component.name === name,
    );

    if (!existentComponent) {
      this.components.push({
        name,
        status: status,
      });
    } else {
      existentComponent.status = status;
    }

    this.updateStatus();
  }

  private async updateStatus() {
    this.status = this.components.every(
      (component) => component.status === 'up',
    )
      ? 'up'
      : 'down';
  }

  isHealthy(): boolean {
    return this.status === 'up';
  }
}
