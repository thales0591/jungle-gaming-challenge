import { AggregateRoot } from '@core/domain/entities/aggregate-root';
import { UniqueId } from '@core/domain/value-objects/unique-id';

interface TestProps {
  name: string;
  value: number;
}

class TestAggregateRoot extends AggregateRoot<TestProps> {
  constructor(props: TestProps, id?: UniqueId) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get value(): number {
    return this.props.value;
  }
}

describe('AggregateRoot', () => {
  it('should be able to create aggregate root with automatic createdAt timestamp', () => {
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 });

    expect(aggregate.createdAt).toBeInstanceOf(Date);
    expect(aggregate.createdAt).toBeDefined();
  });

  it('should be able to create aggregate root with generated id', () => {
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 });

    expect(aggregate.id).toBeDefined();
    expect(aggregate.id.value).toBeTruthy();
  });

  it('should be able to create aggregate root with custom id', () => {
    const customId = UniqueId.create();
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 }, customId);

    expect(aggregate.id.value).toBe(customId.value);
  });

  it('should be able to have createdAt set to current time', () => {
    const before = new Date();
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 });
    const after = new Date();

    expect(aggregate.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(aggregate.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('should be able to have undefined updatedAt initially', () => {
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 });

    expect(aggregate.updatedAt).toBeUndefined();
  });

  it('should be able to access createdAt through getter', () => {
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 });
    const createdAt = aggregate.createdAt;

    expect(createdAt).toBeInstanceOf(Date);
    expect(createdAt).toBe(aggregate.createdAt);
  });

  it('should be able to access updatedAt through getter', () => {
    const aggregate = new TestAggregateRoot({ name: 'Test', value: 123 });

    expect(aggregate.updatedAt).toBeUndefined();
  });

  it('should be able to inherit entity properties', () => {
    const aggregate = new TestAggregateRoot({ name: 'Test Name', value: 456 });

    expect(aggregate.name).toBe('Test Name');
    expect(aggregate.value).toBe(456);
  });

  it('should be able to inherit entity equality logic', () => {
    const id = UniqueId.create();
    const aggregate1 = new TestAggregateRoot({ name: 'Test1', value: 123 }, id);
    const aggregate2 = new TestAggregateRoot({ name: 'Test2', value: 456 }, id);

    expect(aggregate1.equals(aggregate2)).toBe(true);
  });

  it('should not be able to consider different aggregates as equal', () => {
    const aggregate1 = new TestAggregateRoot({ name: 'Test', value: 123 });
    const aggregate2 = new TestAggregateRoot({ name: 'Test', value: 123 });

    expect(aggregate1.equals(aggregate2)).toBe(false);
  });

  it('should be able to create multiple aggregates with different timestamps', () => {
    const aggregate1 = new TestAggregateRoot({ name: 'Test1', value: 123 });
    const aggregate2 = new TestAggregateRoot({ name: 'Test2', value: 456 });

    expect(aggregate1.createdAt).toBeDefined();
    expect(aggregate2.createdAt).toBeDefined();
    expect(aggregate1.id.value).not.toBe(aggregate2.id.value);
  });
});
