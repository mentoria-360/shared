import { Duration } from '../../src';

describe('Duration', () => {
  test('should create from seconds', () => {
    const duration = Duration.inSeconds(123);
    expect(duration.inSeconds).toBe(123);
  });

  test('should create from days, hours, minutes and seconds', () => {
    const duration = Duration.from({ d: 1, h: 2, m: 3, s: 4 });
    expect(duration.inSeconds).toBe(93784);
  });

  test('should create one day duration', () => {
    const duration = Duration.from({ d: 1 });
    expect(duration.inDays).toBe(1);
    expect(duration.inHours).toBe(24);
    expect(duration.inMinutes).toBe(1440);
    expect(duration.inSeconds).toBe(86400);
  });

  test('should create 30 seconds duration', () => {
    const duration = Duration.from({ s: 30 });
    expect(duration.inDays).toBe(0);
    expect(duration.inHours).toBe(0);
    expect(duration.inMinutes).toBe(0);
    expect(duration.inSeconds).toBe(30);
    expect(duration.toHMS).toBe('00h 00m 30s');
  });

  test('should create zero duration', () => {
    const duration = Duration.zero();
    expect(duration.inSeconds).toBe(0);
  });

  test('should convert to days, hours and minutes', () => {
    const duration = Duration.from({ d: 1, h: 2, m: 3, s: 4 });
    expect(duration.inDays).toBe(1);
    expect(duration.inHours).toBe(26);
    expect(duration.inMinutes).toBe(1563);
  });

  test('should format to HMS, HM and MS', () => {
    const duration = Duration.from({ d: 1, h: 2, m: 3, s: 4 });
    expect(duration.toHMS).toBe('26h 03m 04s');
    expect(duration.toHM).toBe('26h 03m');
    expect(duration.toMS).toBe('1563m 04s');
  });

  test('should add durations', () => {
    const duration1 = Duration.from({ d: 1, h: 2, m: 3, s: 4 });
    const duration2 = Duration.from({ h: 1, m: 2, s: 3 });
    const duration3 = duration1.add(duration2);
    expect(duration3.inSeconds).toBe(97507);
  });

  test('should throw when duration is negative', () => {
    expect(() => Duration.inSeconds(-10)).toThrow('DURATION_NEGATIVE');
  });

  test('should expose hours and minutes parts', () => {
    const duration = Duration.from({ d: 1, h: 2, m: 3, s: 4 });
    expect(duration.hoursAndMinutes).toEqual({ hours: '26', minutes: '03' });
  });

  test('should tryCreate valid duration', () => {
    const duration = Duration.tryCreate(10000);
    expect(duration.isOk).toBe(true);
  });

  test('should tryCreate invalid duration', () => {
    const duration = Duration.tryCreate(-10000);
    expect(duration.isOk).toBe(false);
    expect(duration.errors[0]).toBe('DURATION_NEGATIVE');
  });

  test('should create valid duration via create', () => {
    const duration = Duration.create(60);
    expect(duration.inSeconds).toBe(60);
  });

  test('should throw via create when duration is negative', () => {
    expect(() => Duration.create(-1)).toThrow();
  });
});
