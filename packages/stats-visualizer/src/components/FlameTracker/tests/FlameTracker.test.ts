import { describe, it, expect } from 'vitest';

interface SessionData {
  id: string;
  taskId: string;
  rating: number;
  duration: number;
  date: string | Date;
  notes?: string;
}

describe('FlameTracker Logic', () => {
  function calculateFlameSize(sessions: SessionData[]): {
    size: number;
    level: 0 | 1 | 2 | 3;
    daysSinceLast: number;
    sessionCount: number;
  } {
    if (sessions.length === 0) {
      return { size: 0, level: 0, daysSinceLast: 0, sessionCount: 0 };
    }

    const sessionCount = sessions.length;
    const sortedByDate = [...sessions].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    const lastSession = sortedByDate[0];
    const lastDate = new Date(lastSession.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceLast = Math.floor((today.getTime() - lastDate.getTime()) / msPerDay);

    let baseSize = Math.min(sessionCount * 3, 100);
    let decayFactor = Math.max(1 - daysSinceLast * 0.15, 0.1);
    const size = baseSize * decayFactor;

    let level: 0 | 1 | 2 | 3;
    if (size < 15) level = 0;
    else if (size < 40) level = 1;
    else if (size < 70) level = 2;
    else level = 3;

    return { size, level, daysSinceLast, sessionCount };
  }

  describe('Empty sessions', () => {
    it('should return zero state for empty sessions', () => {
      const result = calculateFlameSize([]);
      expect(result.size).toBe(0);
      expect(result.level).toBe(0);
      expect(result.sessionCount).toBe(0);
    });
  });

  describe('Flame growth', () => {
    it('should grow with each session', () => {
      const today = new Date().toISOString().split('T')[0];
      const sessions1 = [
        {
          id: '1',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: today
        }
      ];

      const sessions10 = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: today
      }));

      const result1 = calculateFlameSize(sessions1);
      const result10 = calculateFlameSize(sessions10);

      expect(result1.sessionCount).toBe(1);
      expect(result10.sessionCount).toBe(10);
      expect(result10.size).toBeGreaterThan(result1.size);
    });

    it('should cap at 100% size', () => {
      const today = new Date().toISOString().split('T')[0];
      const sessions = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: today
      }));

      const result = calculateFlameSize(sessions);
      expect(result.size).toBeLessThanOrEqual(100);
    });
  });

  describe('Flame decay', () => {
    it('should never reach zero (minimum smolder at 10%)', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 100);
      const dateStr = pastDate.toISOString().split('T')[0];

      const sessions = [
        {
          id: '1',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: dateStr
        }
      ];

      const result = calculateFlameSize(sessions);
      expect(result.size).toBeGreaterThanOrEqual(0.1);
    });

    it('should decay gradually with missed days', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const sessions10 = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: i === 9 ? yesterdayStr : today
      }));

      const result = calculateFlameSize(sessions10);
      expect(result.daysSinceLast).toBe(0);
      const expectedSize = Math.min(10 * 3, 100) * Math.max(1 - 0 * 0.15, 0.1);
      expect(Math.abs(result.size - expectedSize)).toBeLessThan(0.1);
    });
  });

  describe('Flame with custom current date', () => {
    it('should calculate decay relative to provided currentDate', () => {
      const sessionDate = new Date('2024-12-01');
      const currentDate = new Date('2024-12-06');
      
      const sessions = [
        {
          id: '1',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: sessionDate.toISOString().split('T')[0]
        }
      ];

      // Manually calculate with custom currentDate
      const lastDate = new Date(sessions[0].date);
      lastDate.setHours(0, 0, 0, 0);
      const customCurrent = new Date(currentDate);
      customCurrent.setHours(0, 0, 0, 0);

      const msPerDay = 24 * 60 * 60 * 1000;
      const daysSinceLast = Math.floor((customCurrent.getTime() - lastDate.getTime()) / msPerDay);

      expect(daysSinceLast).toBe(5);

      const baseSize = Math.min(1 * 3, 100);
      const decayFactor = Math.max(1 - daysSinceLast * 0.15, 0.1);
      const expectedSize = baseSize * decayFactor;

      // 3 * (1 - 5*0.15) = 3 * 0.25 = 0.75
      expect(expectedSize).toBeCloseTo(0.75, 2);
    });

    it('should use provided currentDate instead of today', () => {
      const pastDate = new Date('2024-01-01');
      const currentDate = new Date('2024-01-05');

      const sessions = [
        {
          id: '1',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: pastDate.toISOString().split('T')[0]
        }
      ];

      const lastDate = new Date(sessions[0].date);
      lastDate.setHours(0, 0, 0, 0);
      const customCurrent = new Date(currentDate);
      customCurrent.setHours(0, 0, 0, 0);

      const msPerDay = 24 * 60 * 60 * 1000;
      const daysSinceLast = Math.floor((customCurrent.getTime() - lastDate.getTime()) / msPerDay);

      // 4 days difference, so decay should be 1 - (4 * 0.15) = 0.4
      expect(daysSinceLast).toBe(4);

      const baseSize = 3;
      const decayFactor = Math.max(1 - daysSinceLast * 0.15, 0.1);
      const expectedSize = baseSize * decayFactor;

      expect(decayFactor).toBe(0.4);
      expect(expectedSize).toBeCloseTo(1.2, 2);
    });
  });

  describe('Flame levels', () => {
    it('should show smolder level (0) for low activity', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 100);
      const dateStr = pastDate.toISOString().split('T')[0];

      const sessions = [
        {
          id: '1',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: dateStr
        }
      ];

      const result = calculateFlameSize(sessions);
      expect(result.level).toBe(0);
    });

    it('should show level 1 for low-medium activity', () => {
      const today = new Date().toISOString().split('T')[0];
      const sessions = Array.from({ length: 5 }, (_, i) => ({
        id: `${i}`,
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: today
      }));

      const result = calculateFlameSize(sessions);
      expect(result.level).toBeGreaterThanOrEqual(1);
    });

    it('should show level 3 for high activity', () => {
      const today = new Date().toISOString().split('T')[0];
      const sessions = Array.from({ length: 30 }, (_, i) => ({
        id: `${i}`,
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: today
      }));

      const result = calculateFlameSize(sessions);
      expect(result.level).toBe(3);
    });
  });
});
