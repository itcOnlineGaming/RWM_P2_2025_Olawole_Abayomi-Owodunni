import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	saveSessions,
	getSessions,
	saveTasks,
	getTasks,
	getAppTime,
	setAppTime,
	advanceAppTime,
	clearStoredData,
	hasStoredData
} from './storage';
import type { SessionData, TaskData } from '@ayola/stats-visualizer';

// Mock localStorage for testing
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
});

describe('Storage Utility - Sessions', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should save sessions to localStorage', () => {
		const sessions: SessionData[] = [
			{
				id: 'session-1',
				taskId: 'task-1',
				rating: 5,
				duration: 60,
				date: '2024-12-01',
				notes: 'Test session'
			}
		];

		saveSessions(sessions);
		const stored = localStorage.getItem('rwm_sessions');
		expect(stored).toBeDefined();
		expect(JSON.parse(stored!)).toEqual(sessions);
	});

	it('should retrieve sessions from localStorage', () => {
		const sessions: SessionData[] = [
			{
				id: 'session-1',
				taskId: 'task-1',
				rating: 4,
				duration: 45,
				date: '2024-12-02',
				notes: 'Retrieved session'
			}
		];

		saveSessions(sessions);
		const retrieved = getSessions();
		expect(retrieved).toEqual(sessions);
	});

	it('should return empty array if no sessions stored', () => {
		const retrieved = getSessions();
		expect(retrieved).toEqual([]);
	});

	it('should handle corrupted session data', () => {
		localStorage.setItem('rwm_sessions', 'invalid json {');
		const retrieved = getSessions();
		expect(retrieved).toEqual([]);
	});

	it('should save multiple sessions', () => {
		const sessions: SessionData[] = [
			{
				id: 'session-1',
				taskId: 'task-1',
				rating: 5,
				duration: 60,
				date: '2024-12-01',
				notes: 'Session 1'
			},
			{
				id: 'session-2',
				taskId: 'task-2',
				rating: 3,
				duration: 30,
				date: '2024-12-02',
				notes: 'Session 2'
			}
		];

		saveSessions(sessions);
		const retrieved = getSessions();
		expect(retrieved).toHaveLength(2);
		expect(retrieved).toEqual(sessions);
	});
});

describe('Storage Utility - Tasks', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should save tasks to localStorage', () => {
		const tasks: TaskData[] = [
			{
				id: 'task-1',
				title: 'Test Task',
				description: 'A test task',
				completedDate: '2024-12-01'
			}
		];

		saveTasks(tasks);
		const stored = localStorage.getItem('rwm_tasks');
		expect(stored).toBeDefined();
		expect(JSON.parse(stored!)).toEqual(tasks);
	});

	it('should retrieve tasks from localStorage', () => {
		const tasks: TaskData[] = [
			{
				id: 'task-1',
				title: 'Retrieve Task',
				description: 'Task to retrieve',
				completedDate: '2024-12-03'
			}
		];

		saveTasks(tasks);
		const retrieved = getTasks();
		expect(retrieved).toEqual(tasks);
	});

	it('should return empty array if no tasks stored', () => {
		const retrieved = getTasks();
		expect(retrieved).toEqual([]);
	});

	it('should handle corrupted task data', () => {
		localStorage.setItem('rwm_tasks', 'invalid json {');
		const retrieved = getTasks();
		expect(retrieved).toEqual([]);
	});

	it('should save multiple tasks', () => {
		const tasks: TaskData[] = [
			{
				id: 'task-1',
				title: 'Task 1',
				description: 'Description 1',
				completedDate: '2024-12-01'
			},
			{
				id: 'task-2',
				title: 'Task 2',
				description: 'Description 2',
				completedDate: '2024-12-02'
			}
		];

		saveTasks(tasks);
		const retrieved = getTasks();
		expect(retrieved).toHaveLength(2);
		expect(retrieved).toEqual(tasks);
	});
});

describe('Storage Utility - App Time', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should return current date if no app time is set', () => {
		const now = new Date();
		const appTime = getAppTime();
		expect(appTime.toDateString()).toBe(now.toDateString());
	});

	it('should set and retrieve app time', () => {
		const testDate = new Date('2024-12-15');
		setAppTime(testDate);
		const retrieved = getAppTime();
		expect(retrieved.toDateString()).toBe(testDate.toDateString());
	});

	it('should persist app time across calls', () => {
		const testDate = new Date('2024-12-20');
		setAppTime(testDate);
		const first = getAppTime();
		const second = getAppTime();
		expect(first.toDateString()).toBe(second.toDateString());
	});

	it('should handle corrupted app time data', () => {
		localStorage.setItem('rwm_app_time', 'invalid date');
		const appTime = getAppTime();
		expect(appTime).toBeInstanceOf(Date);
	});

	it('should advance app time by days', () => {
		const startDate = new Date('2024-12-01');
		setAppTime(startDate);

		const newDate = advanceAppTime(5);
		const expected = new Date('2024-12-06');
		expect(newDate.toDateString()).toBe(expected.toDateString());
	});

	it('should advance app time by weeks', () => {
		const startDate = new Date('2024-12-01');
		setAppTime(startDate);

		const newDate = advanceAppTime(7);
		const expected = new Date('2024-12-08');
		expect(newDate.toDateString()).toBe(expected.toDateString());
	});

	it('should advance app time by months', () => {
		const startDate = new Date('2024-12-01');
		setAppTime(startDate);

		const newDate = advanceAppTime(30);
		const expected = new Date('2024-12-31');
		expect(newDate.toDateString()).toBe(expected.toDateString());
	});

	it('should persist advanced app time', () => {
		const startDate = new Date('2024-12-01');
		setAppTime(startDate);

		advanceAppTime(5);
		const retrieved = getAppTime();
		const expected = new Date('2024-12-06');
		expect(retrieved.toDateString()).toBe(expected.toDateString());
	});
});

describe('Storage Utility - Clear Data', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should clear all stored data', () => {
		const sessions: SessionData[] = [
			{
				id: 'session-1',
				taskId: 'task-1',
				rating: 5,
				duration: 60,
				date: '2024-12-01',
				notes: 'Test'
			}
		];
		const tasks: TaskData[] = [
			{
				id: 'task-1',
				title: 'Task',
				description: 'Desc',
				completedDate: '2024-12-01'
			}
		];

		saveSessions(sessions);
		saveTasks(tasks);
		setAppTime(new Date('2024-12-15'));

		clearStoredData();

		expect(getSessions()).toEqual([]);
		expect(getTasks()).toEqual([]);
		expect(localStorage.getItem('rwm_app_time')).toBeNull();
	});

	it('should correctly report hasStoredData', () => {
		expect(hasStoredData()).toBe(false);

		const sessions: SessionData[] = [
			{
				id: 'session-1',
				taskId: 'task-1',
				rating: 5,
				duration: 60,
				date: '2024-12-01',
				notes: 'Test'
			}
		];
		saveSessions(sessions);

		expect(hasStoredData()).toBe(true);

		clearStoredData();
		expect(hasStoredData()).toBe(false);
	});
});
