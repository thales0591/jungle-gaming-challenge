import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('UniqueId', () => {
  it('should be able to create a new unique id with generated UUID', () => {
    const id = new UniqueId();

    expect(id).toBeDefined();
    expect(id.value).toBeTruthy();
    expect(typeof id.value).toBe('string');
  });

  it('should be able to create unique id with custom value', () => {
    const customValue = '123e4567-e89b-12d3-a456-426614174000';
    const id = new UniqueId(customValue);

    expect(id.value).toBe(customValue);
  });

  it('should be able to create using factory method', () => {
    const id = UniqueId.create();

    expect(id).toBeDefined();
    expect(id.value).toBeTruthy();
  });

  it('should be able to create with custom value using factory', () => {
    const customValue = '123e4567-e89b-12d3-a456-426614174000';
    const id = UniqueId.create(customValue);

    expect(id.value).toBe(customValue);
  });

  it('should be able to generate different UUIDs for different instances', () => {
    const id1 = new UniqueId();
    const id2 = new UniqueId();

    expect(id1.value).not.toBe(id2.value);
  });

  it('should be able to convert to string', () => {
    const customValue = '123e4567-e89b-12d3-a456-426614174000';
    const id = new UniqueId(customValue);

    expect(id.toString()).toBe(customValue);
  });

  it('should be able to create valid UUID v4 format', () => {
    const id = new UniqueId();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(id.value).toMatch(uuidRegex);
  });

  it('should not be able to create with invalid UUID format', () => {
    expect(() => new UniqueId('invalid-uuid')).toThrow();
  });

  it('should not be able to create with empty string', () => {
    expect(() => new UniqueId('')).toThrow();
  });

  it('should not be able to create with invalid UUID v4', () => {
    expect(() => new UniqueId('not-a-uuid-at-all')).toThrow();
  });

  it('should not be able to create with malformed UUID', () => {
    expect(() => new UniqueId('123-456-789')).toThrow();
  });

  it('should be able to access value property', () => {
    const customValue = '123e4567-e89b-12d3-a456-426614174000';
    const id = new UniqueId(customValue);

    expect(id.value).toBe(customValue);
  });

  it('should be able to create multiple instances independently', () => {
    const id1 = UniqueId.create();
    const id2 = UniqueId.create();
    const id3 = UniqueId.create();

    expect(id1.value).not.toBe(id2.value);
    expect(id2.value).not.toBe(id3.value);
    expect(id1.value).not.toBe(id3.value);
  });
});
