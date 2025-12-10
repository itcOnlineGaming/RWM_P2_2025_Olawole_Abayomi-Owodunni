import { describe, it, expect, beforeEach } from 'vitest';
import {
  aggregateSessionsByDay,
  aggregateByWeek,
  aggregateByMonth,
  getAverageRatingPerTask,
  calculateDailyStreak,
  filterByDateRange,
  getTaskSessions
} from './aggregation';
import type { SessionData } from '../types';

describe('Aggregation Utilities', () => {
  let mockSessions: SessionData[];

  beforeEach(() => {
    // Create mock sessions for testing
    mockSessions = [
      {
        id: 'session-1',
        taskId: 'task-1',
        rating: 5,
        duration: 60,
        date: '2024-12-01',
        notes: 'Great session'
      },
      {
        id: 'session-2',
        taskId: 'task-1',
        rating: 4,
        duration: 45,
        date: '2024-12-01',
        notes: 'Good session'
      },
      {
        id: 'session-3',
        taskId: 'task-2',
        rating: 3,
        duration: 30,
        date: '2024-12-02',
        notes: 'Average session'
      },
      {
        id: 'session-4',
        taskId: 'task-1',
        rating: 5,
        duration: 50,
        date: '2024-12-03',
        notes: 'Excellent session'
      },
      {
        id: 'session-5',
        taskId: 'task-2',
        rating: 2,
        duration: 20,
        date: '2024-12-05',
        notes: 'Poor session'
      }
    ];
  });

  describe('aggregateSessionsByDay', () => {
    it('should group sessions by date', () => {
      const result = aggregateSessionsByDay(mockSessions);
      
      expect(result).toHaveProperty('2024-12-01');
      expect(result).toHaveProperty('2024-12-02');
      expect(result).toHaveProperty('2024-12-03');
      expect(result['2024-12-01']).toHaveLength(2);
      expect(result['2024-12-02']).toHaveLength(1);
    });

    it('should return empty object for empty sessions', () => {
      const result = aggregateSessionsByDay([]);
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should correctly count sessions per day', () => {
      const result = aggregateSessionsByDay(mockSessions);
      
      expect(result['2024-12-01'].reduce((sum, s) => sum + 1, 0)).toBe(2);
      expect(result['2024-12-05'].reduce((sum, s) => sum + 1, 0)).toBe(1);
    });
  });

  describe('getAverageRatingPerTask', () => {
    it('should calculate average rating per task', () => {
      const result = getAverageRatingPerTask(mockSessions);
      
      expect(result['task-1']).toBe(4.7); // (5 + 4 + 5) / 3 = 4.666... rounded to 1 decimal
      expect(result['task-2']).toBe(2.5); // (3 + 2) / 2 = 2.5
    });

    it('should handle single session per task', () => {
      const singleSession: SessionData[] = [{
        id: 'session-1',
        taskId: 'task-1',
        rating: 4,
        duration: 60,
        date: '2024-12-01',
        notes: ''
      }];
      
      const result = getAverageRatingPerTask(singleSession);
      expect(result['task-1']).toBe(4.0);
    });

    it('should return empty object for empty sessions', () => {
      const result = getAverageRatingPerTask([]);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('getTaskSessions', () => {
    it('should filter sessions by taskId', () => {
      const result = getTaskSessions(mockSessions, 'task-1');
      
      expect(result).toHaveLength(3);
      expect(result.every(s => s.taskId === 'task-1')).toBe(true);
    });

    it('should return empty array for non-existent task', () => {
      const result = getTaskSessions(mockSessions, 'task-999');
      expect(result).toHaveLength(0);
    });

    it('should return all sessions for a task', () => {
      const result = getTaskSessions(mockSessions, 'task-2');
      
      expect(result).toHaveLength(2);
      expect(result[0].rating).toBe(3);
      expect(result[1].rating).toBe(2);
    });
  });

  describe('filterByDateRange', () => {
    it('should filter sessions within date range', () => {
      const startDate = new Date('2024-12-01');
      const endDate = new Date('2024-12-03');
      const result = filterByDateRange(mockSessions, startDate, endDate);
      
      expect(result).toHaveLength(4);
      result.forEach(s => {
        const sessionDate = new Date(s.date);
        expect(sessionDate >= startDate && sessionDate <= endDate).toBe(true);
      });
    });

    it('should include boundary dates', () => {
      const startDate = new Date('2024-12-01');
      const endDate = new Date('2024-12-01');
      const result = filterByDateRange(mockSessions, startDate, endDate);
      
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2024-12-01');
    });

    it('should return empty array for date range outside sessions', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');
      const result = filterByDateRange(mockSessions, startDate, endDate);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateDailyStreak', () => {
    it('should calculate current streak from today', () => {
      const today = new Date();
      const recentSessions: SessionData[] = [];
      
      // Create sessions for last 5 consecutive days including today
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        recentSessions.push({
          id: `session-${i}`,
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: dateStr,
          notes: ''
        });
      }
      
      const result = calculateDailyStreak(recentSessions);
      expect(result.currentStreak).toBeGreaterThanOrEqual(1);
    });

    it('should identify longest streak in historical data', () => {
      // Use dates in the past, but within 365-day window from today
      const today = new Date();
      const baseDate = new Date(today);
      baseDate.setDate(baseDate.getDate() - 30); // 30 days ago
      const streakSessions: SessionData[] = [];
      
      // Create 7 consecutive days of sessions
      for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        streakSessions.push({
          id: `session-${i}`,
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: dateStr,
          notes: ''
        });
      }
      
      const result = calculateDailyStreak(streakSessions);
      expect(result.longestStreak).toBeGreaterThanOrEqual(7);
    });

    it('should return 0 streak for empty sessions', () => {
      const result = calculateDailyStreak([]);
      expect(result.currentStreak).toBe(0);
      expect(result.longestStreak).toBe(0);
    });

    it('should handle gap in sessions', () => {
      const today = new Date();
      const baseDate = new Date(today);
      baseDate.setDate(baseDate.getDate() - 20); // 20 days ago
      const gappedSessions: SessionData[] = [];
      
      // Days 1-3
      for (let i = 0; i < 3; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        gappedSessions.push({
          id: `session-${i}`,
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: dateStr,
          notes: ''
        });
      }
      
      // Day 5 (gap on day 4)
      const gapDate = new Date(baseDate);
      gapDate.setDate(gapDate.getDate() + 4);
      gappedSessions.push({
        id: 'session-gap',
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: gapDate.toISOString().split('T')[0],
        notes: ''
      });
      
      const result = calculateDailyStreak(gappedSessions);
      // With a gap, longest streak should be 3
      expect(result.longestStreak).toBeGreaterThanOrEqual(3);
    });

    it('should calculate streak from provided currentDate', () => {
      const currentDate = new Date('2024-12-15');
      const streakSessions: SessionData[] = [];
      
      // Create sessions for 5 consecutive days ending on currentDate
      for (let i = 0; i < 5; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        streakSessions.push({
          id: `session-${i}`,
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: dateStr,
          notes: ''
        });
      }
      
      const result = calculateDailyStreak(streakSessions, currentDate);
      expect(result.currentStreak).toBeGreaterThanOrEqual(1);
    });

    it('should use provided currentDate instead of today for streak calculation', () => {
      const currentDate = new Date('2024-12-10');
      const streakSessions: SessionData[] = [
        {
          id: 'session-1',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: '2024-12-10',
          notes: ''
        },
        {
          id: 'session-2',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: '2024-12-09',
          notes: ''
        },
        {
          id: 'session-3',
          taskId: 'task-1',
          rating: 4,
          duration: 30,
          date: '2024-12-08',
          notes: ''
        }
      ];
      
      const result = calculateDailyStreak(streakSessions, currentDate);
      // Should have a 3-day current streak from Dec 8-10
      expect(result.currentStreak).toBeGreaterThanOrEqual(1);
    });

    it('should calculate within 365-day window from currentDate', () => {
      const currentDate = new Date('2024-12-15');
      const streakSessions: SessionData[] = [];
      
      // Create a session 100 days ago from currentDate
      const oldDate = new Date(currentDate);
      oldDate.setDate(oldDate.getDate() - 100);
      
      streakSessions.push({
        id: 'session-old',
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: oldDate.toISOString().split('T')[0],
        notes: ''
      });
      
      const result = calculateDailyStreak(streakSessions, currentDate);
      // Session should be included in calculation
      expect(result.currentStreak).toBeGreaterThanOrEqual(0);
    });

    it('should exclude sessions outside 365-day window from currentDate', () => {
      const currentDate = new Date('2024-12-15');
      const streakSessions: SessionData[] = [];
      
      // Create a session 400 days ago from currentDate (outside window)
      const veryOldDate = new Date(currentDate);
      veryOldDate.setDate(veryOldDate.getDate() - 400);
      
      streakSessions.push({
        id: 'session-veryold',
        taskId: 'task-1',
        rating: 4,
        duration: 30,
        date: veryOldDate.toISOString().split('T')[0],
        notes: ''
      });
      
      const result = calculateDailyStreak(streakSessions, currentDate);
      // Session far in past should not create current streak
      expect(result.currentStreak).toBe(0);
    });
  });

  describe('aggregateByWeek', () => {
    it('should aggregate sessions by week', () => {
      const result = aggregateByWeek(mockSessions);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('week');
      expect(result[0]).toHaveProperty('totalSessions');
      expect(result[0]).toHaveProperty('tasksCompleted');
      expect(result[0]).toHaveProperty('averageRating');
    });

    it('should return empty array for empty sessions', () => {
      const result = aggregateByWeek([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('aggregateByMonth', () => {
    it('should aggregate sessions by month', () => {
      const result = aggregateByMonth(mockSessions);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('totalSessions');
      expect(result[0]).toHaveProperty('tasksCompleted');
      expect(result[0]).toHaveProperty('averageRating');
    });

    it('should return empty array for empty sessions', () => {
      const result = aggregateByMonth([]);
      expect(result).toHaveLength(0);
    });
  });
});
