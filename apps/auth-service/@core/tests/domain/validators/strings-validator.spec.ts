import { StringValidator } from '@core/domain/validators/strings-validator';

describe('StringValidator', () => {
  describe('isUUIDOrThrows', () => {
    it('should be able to validate valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';

      expect(() =>
        StringValidator.isUUIDOrThrows('id', validUUID),
      ).not.toThrow();
    });

    it('should be able to validate UUID v4 format', () => {
      const validUUIDv4 = '550e8400-e29b-41d4-a716-446655440000';

      expect(() =>
        StringValidator.isUUIDOrThrows('userId', validUUIDv4),
      ).not.toThrow();
    });

    it('should not be able to validate invalid UUID format', () => {
      expect(() =>
        StringValidator.isUUIDOrThrows('id', 'invalid-uuid'),
      ).toThrow('id is not a valid UUID');
    });

    it('should not be able to validate empty string as UUID', () => {
      expect(() => StringValidator.isUUIDOrThrows('id', '')).toThrow(
        'id is not a valid UUID',
      );
    });

    it('should not be able to validate malformed UUID', () => {
      expect(() =>
        StringValidator.isUUIDOrThrows('id', '123-456-789'),
      ).toThrow('id is not a valid UUID');
    });

    it('should not be able to validate random string as UUID', () => {
      expect(() =>
        StringValidator.isUUIDOrThrows('id', 'not-a-uuid-at-all'),
      ).toThrow('id is not a valid UUID');
    });
  });

  describe('isEmailOrThrows', () => {
    it('should be able to validate valid email', () => {
      expect(() =>
        StringValidator.isEmailOrThrows('email', 'johndoe@example.com'),
      ).not.toThrow();
    });

    it('should be able to validate email with subdomain', () => {
      expect(() =>
        StringValidator.isEmailOrThrows('email', 'user@mail.example.com'),
      ).not.toThrow();
    });

    it('should be able to validate email with plus sign', () => {
      expect(() =>
        StringValidator.isEmailOrThrows('email', 'user+test@example.com'),
      ).not.toThrow();
    });

    it('should not be able to validate invalid email format', () => {
      expect(() =>
        StringValidator.isEmailOrThrows('email', 'invalid-email'),
      ).toThrow('email is not a valid e-mail');
    });

    it('should not be able to validate email without domain', () => {
      expect(() => StringValidator.isEmailOrThrows('email', 'user@')).toThrow(
        'email is not a valid e-mail',
      );
    });

    it('should not be able to validate email without at symbol', () => {
      expect(() =>
        StringValidator.isEmailOrThrows('email', 'userexample.com'),
      ).toThrow('email is not a valid e-mail');
    });

    it('should not be able to validate empty string as email', () => {
      expect(() => StringValidator.isEmailOrThrows('email', '')).toThrow(
        'email is not a valid e-mail',
      );
    });
  });

  describe('isPasswordOrThrows', () => {
    it('should be able to validate password with 8 characters', () => {
      expect(() => StringValidator.isPasswordOrThrows('12345678')).not.toThrow();
    });

    it('should be able to validate password with more than 8 characters', () => {
      expect(() =>
        StringValidator.isPasswordOrThrows('password123456'),
      ).not.toThrow();
    });

    it('should be able to validate long password', () => {
      const longPassword = 'a'.repeat(100);
      expect(() => StringValidator.isPasswordOrThrows(longPassword)).not.toThrow();
    });

    it('should not be able to validate password with less than 8 characters', () => {
      expect(() => StringValidator.isPasswordOrThrows('1234567')).toThrow(
        'The password provided is not valid or weak',
      );
    });

    it('should not be able to validate very short password', () => {
      expect(() => StringValidator.isPasswordOrThrows('123')).toThrow(
        'The password provided is not valid or weak',
      );
    });

    it('should not be able to validate empty password', () => {
      expect(() => StringValidator.isPasswordOrThrows('')).toThrow(
        'The password provided is not valid or weak',
      );
    });

    it('should not be able to validate password with exactly 7 characters', () => {
      expect(() => StringValidator.isPasswordOrThrows('1234567')).toThrow(
        'The password provided is not valid or weak',
      );
    });
  });

  describe('isNotEmptyOrThrows', () => {
    it('should be able to validate non-empty string', () => {
      expect(() =>
        StringValidator.isNotEmptyOrThrows('name', 'John Doe'),
      ).not.toThrow();
    });

    it('should be able to validate single character string', () => {
      expect(() => StringValidator.isNotEmptyOrThrows('name', 'a')).not.toThrow();
    });

    it('should be able to validate string with spaces', () => {
      expect(() =>
        StringValidator.isNotEmptyOrThrows('name', '  John  '),
      ).not.toThrow();
    });

    it('should not be able to validate empty string', () => {
      expect(() => StringValidator.isNotEmptyOrThrows('name', '')).toThrow(
        'name cannot be empty',
      );
    });

    it('should not be able to validate and show custom field name in error', () => {
      expect(() => StringValidator.isNotEmptyOrThrows('username', '')).toThrow(
        'username cannot be empty',
      );
    });

    it('should not be able to validate empty field with different field name', () => {
      expect(() => StringValidator.isNotEmptyOrThrows('description', '')).toThrow(
        'description cannot be empty',
      );
    });
  });
});
