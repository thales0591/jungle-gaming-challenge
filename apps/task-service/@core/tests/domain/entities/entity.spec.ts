import { Entity } from '@core/domain/entities/entity';
import { UniqueId } from '@core/domain/value-objects/unique-id';

interface TestProps {
  name: string;
  value: number;
}

class TestEntity extends Entity<TestProps> {
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

describe('Entity', () => {
  it('should be able to create entity with generated id', () => {
    const entity = new TestEntity({ name: 'Test', value: 123 });

    expect(entity.id).toBeDefined();
    expect(entity.id.value).toBeTruthy();
  });

  it('should be able to create entity with custom id', () => {
    const customId = UniqueId.create();
    const entity = new TestEntity({ name: 'Test', value: 123 }, customId);

    expect(entity.id.value).toBe(customId.value);
  });

  it('should be able to access entity properties', () => {
    const entity = new TestEntity({ name: 'Test Name', value: 456 });

    expect(entity.name).toBe('Test Name');
    expect(entity.value).toBe(456);
  });

  it('should be able to compare same entity instance', () => {
    const entity = new TestEntity({ name: 'Test', value: 123 });

    expect(entity.equals(entity)).toBe(true);
  });

  it('should be able to compare entities with same id', () => {
    const id = UniqueId.create();
    const entity1 = new TestEntity({ name: 'Test1', value: 123 }, id);
    const entity2 = new TestEntity({ name: 'Test2', value: 456 }, id);

    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should not be able to compare entities with different ids', () => {
    const entity1 = new TestEntity({ name: 'Test1', value: 123 });
    const entity2 = new TestEntity({ name: 'Test2', value: 456 });

    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should be able to compare entities using equals method', () => {
    const id = UniqueId.create();
    const entity1 = new TestEntity({ name: 'Test', value: 123 }, id);
    const entity2 = new TestEntity({ name: 'Different', value: 999 }, id);

    expect(entity1.equals(entity2)).toBe(true);
  });

  it('should not be able to consider different entities as equal', () => {
    const entity1 = new TestEntity({ name: 'Test', value: 123 });
    const entity2 = new TestEntity({ name: 'Test', value: 123 });

    expect(entity1.equals(entity2)).toBe(false);
  });

  it('should be able to have different instances with different ids', () => {
    const entity1 = new TestEntity({ name: 'Test', value: 123 });
    const entity2 = new TestEntity({ name: 'Test', value: 123 });

    expect(entity1.id.value).not.toBe(entity2.id.value);
  });

  it('should be able to return id through getter', () => {
    const customId = UniqueId.create();
    const entity = new TestEntity({ name: 'Test', value: 123 }, customId);

    expect(entity.id).toBe(customId);
  });

  it('should be able to maintain entity identity', () => {
    const entity1 = new TestEntity({ name: 'Test', value: 123 });
    const entity2 = entity1;

    expect(entity1.equals(entity2)).toBe(true);
  });
});
