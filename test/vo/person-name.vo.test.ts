import { PersonName } from '../../src';

describe('PersonName', () => {
  test('should create with valid first and last name', () => {
    const result = PersonName.tryCreate('Joao Silva');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Joao Silva');
  });

  test('should trim value before creating', () => {
    const result = PersonName.tryCreate('  Maria   Souza  ');

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe('Maria   Souza');
  });

  test('should fail when name is too short', () => {
    const result = PersonName.tryCreate('Jo');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('PERSON_NAME_TOO_SHORT');
  });

  test('should fail when name is too long', () => {
    const result = PersonName.tryCreate('a'.repeat(51));

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('PERSON_NAME_TOO_LONG');
  });

  test('should fail when name has only one word', () => {
    const result = PersonName.tryCreate('Joao');

    expect(result.isFailure).toBe(true);
    expect(result.errors).toContain('PERSON_NAME_SURNAME_MISSING');
  });

  test('should create with create method', () => {
    const value = PersonName.create('Ana Clara');

    expect(value.value).toBe('Ana Clara');
  });

  test('should expose name parts and initials', () => {
    const name = PersonName.create('João Silva Pereira');

    expect(name.firstName).toBe('João');
    expect(name.lastNames).toEqual(['Silva', 'Pereira']);
    expect(name.lastName).toBe('Pereira');
    expect(name.initials).toBe('JP');
  });

  test('should accept apostrophe in name', () => {
    const nameExample = "João D'Ávila";
    const name = PersonName.create(nameExample);
    expect(name.value).toBe(nameExample);
  });

  test('should throw when create receives invalid person name', () => {
    expect(() => PersonName.create('Ana')).toThrow();
  });

  test('should map invalid tryCreate error code', () => {
    const result = PersonName.tryCreate('João');
    expect(result.isFailure).toBe(true);
    expect(result.errors[0]).toBe('PERSON_NAME_SURNAME_MISSING');
  });
});
