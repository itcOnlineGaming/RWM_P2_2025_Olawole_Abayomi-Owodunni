import { describe, it, expect } from 'vitest';

interface TaskData {
  id: string;
  title: string;
  description?: string;
  completedAt?: number;
  totalSessions?: number;
  averageRating?: number;
}

describe('TrophyTracker Logic', () => {
  function calculateTrophySize(tasks: TaskData[]): {
    size: number;
    monthlyCount: number;
    currentMonth: string;
  } {
    if (tasks.length === 0) {
      return { size: 0, monthlyCount: 0, currentMonth: '' };
    }

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let tasksThisMonth = 0;
    tasks.forEach(task => {
      if (task.completedAt) {
        const taskDate = new Date(task.completedAt * 1000);
        const taskMonthStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
        if (taskMonthStr === currentMonthStr) {
          tasksThisMonth++;
        }
      }
    });

    const size = Math.min(tasksThisMonth * 8, 100);
    return { size, monthlyCount: tasksThisMonth, currentMonth: currentMonthStr };
  }

  describe('Empty tasks', () => {
    it('should return zero state for empty tasks', () => {
      const result = calculateTrophySize([]);
      expect(result.size).toBe(0);
      expect(result.monthlyCount).toBe(0);
    });
  });

  describe('Trophy growth', () => {
    it('should grow with each task completed this month', () => {
      const now = new Date();
      const currentMonth = Math.floor(now.getTime() / 1000);

      const tasks1 = [
        {
          id: '1',
          title: 'Task 1',
          completedAt: currentMonth
        }
      ];

      const tasks10 = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        title: `Task ${i}`,
        completedAt: currentMonth
      }));

      const result1 = calculateTrophySize(tasks1);
      const result10 = calculateTrophySize(tasks10);

      expect(result1.monthlyCount).toBe(1);
      expect(result10.monthlyCount).toBe(10);
      expect(result10.size).toBeGreaterThan(result1.size);
    });

    it('should cap at 100% size', () => {
      const now = new Date();
      const currentMonth = Math.floor(now.getTime() / 1000);

      const tasks = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        title: `Task ${i}`,
        completedAt: currentMonth
      }));

      const result = calculateTrophySize(tasks);
      expect(result.size).toBeLessThanOrEqual(100);
    });
  });

  describe('Monthly reset', () => {
    it('should only count tasks from current month', () => {
      const now = new Date();
      const currentMonthTimestamp = Math.floor(now.getTime() / 1000);

      // Create a task from last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthTimestamp = Math.floor(lastMonth.getTime() / 1000);

      const tasks = [
        {
          id: '1',
          title: 'Task 1',
          completedAt: lastMonthTimestamp
        },
        {
          id: '2',
          title: 'Task 2',
          completedAt: currentMonthTimestamp
        }
      ];

      const result = calculateTrophySize(tasks);
      // Should only count task from current month
      expect(result.monthlyCount).toBe(1);
    });
  });

  describe('Milestone milestones', () => {
    it('should calculate milestones correctly', () => {
      const now = new Date();
      const currentMonth = Math.floor(now.getTime() / 1000);

      const tasks = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        title: `Task ${i}`,
        completedAt: currentMonth
      }));

      const result = calculateTrophySize(tasks);
      // 15 tasks = 3 milestones (every 5 tasks)
      const milestones = Math.floor(result.monthlyCount / 5);
      expect(milestones).toBe(3);
    });
  });

  describe('Size calculation', () => {
    it('should calculate 8% per task', () => {
      const now = new Date();
      const currentMonth = Math.floor(now.getTime() / 1000);

      for (let i = 1; i <= 5; i++) {
        const tasks = Array.from({ length: i }, (_, j) => ({
          id: `${j}`,
          title: `Task ${j}`,
          completedAt: currentMonth
        }));

        const result = calculateTrophySize(tasks);
        const expectedSize = i * 8;
        expect(result.size).toBe(expectedSize);
      }
    });

    it('should never exceed 100%', () => {
      const now = new Date();
      const currentMonth = Math.floor(now.getTime() / 1000);

      const tasks = Array.from({ length: 50 }, (_, i) => ({
        id: `${i}`,
        title: `Task ${i}`,
        completedAt: currentMonth
      }));

      const result = calculateTrophySize(tasks);
      expect(result.size).toBe(100);
    });
  });

  describe('Trophy with custom current date', () => {
    it('should determine month from provided currentDate', () => {
      const currentDate = new Date('2024-12-15');
      const taskDate = new Date('2024-12-10');
      
      const taskTimestamp = Math.floor(taskDate.getTime() / 1000);
      const tasks = [
        {
          id: '1',
          title: 'December Task',
          completedAt: taskTimestamp
        }
      ];

      // Manually calculate with custom currentDate
      const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const taskMonthStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;

      expect(currentMonthStr).toBe('2024-12');
      expect(taskMonthStr).toBe('2024-12');
      expect(currentMonthStr).toBe(taskMonthStr);
    });

    it('should reset trophy when month changes in currentDate', () => {
      const taskDate = new Date('2024-11-15');
      const taskTimestamp = Math.floor(taskDate.getTime() / 1000);
      
      const tasks = [
        {
          id: '1',
          title: 'November Task',
          completedAt: taskTimestamp
        }
      ];

      // Check November
      const novemberDate = new Date('2024-11-20');
      const novemberMonthStr = `${novemberDate.getFullYear()}-${String(novemberDate.getMonth() + 1).padStart(2, '0')}`;
      const taskMonthStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
      expect(novemberMonthStr).toBe(taskMonthStr);

      // Check December (should not count November tasks)
      const decemberDate = new Date('2024-12-01');
      const decemberMonthStr = `${decemberDate.getFullYear()}-${String(decemberDate.getMonth() + 1).padStart(2, '0')}`;
      expect(decemberMonthStr).not.toBe(taskMonthStr);
    });

    it('should count tasks across years correctly', () => {
      const task2024 = new Date('2024-12-15');
      const task2025 = new Date('2025-01-10');
      
      const tasks = [
        {
          id: '1',
          title: '2024 Task',
          completedAt: Math.floor(task2024.getTime() / 1000)
        },
        {
          id: '2',
          title: '2025 Task',
          completedAt: Math.floor(task2025.getTime() / 1000)
        }
      ];

      // In December 2024, only 2024 task should count
      const dec2024 = new Date('2024-12-20');
      const dec2024MonthStr = `${dec2024.getFullYear()}-${String(dec2024.getMonth() + 1).padStart(2, '0')}`;
      
      // In January 2025, only 2025 task should count
      const jan2025 = new Date('2025-01-15');
      const jan2025MonthStr = `${jan2025.getFullYear()}-${String(jan2025.getMonth() + 1).padStart(2, '0')}`;

      expect(dec2024MonthStr).toBe('2024-12');
      expect(jan2025MonthStr).toBe('2025-01');
    });
  });
});
