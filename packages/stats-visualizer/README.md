# @ayola/stats-visualizer

**Production-ready Svelte component library** for visualizing activity tracking statistics with zero configuration required. Get real-time insights into session data, task performance, and productivity metrics with beautiful, responsive charts.

> **Easy to use?** ✅ Yes! Install, import, and use in 3 lines of code. Full TypeScript support with built-in data utilities.

## Quick Start (60 seconds)

### 1. Install
```bash
npm install @ayola/stats-visualizer
```

### 2. Import & Use
```svelte
<script lang="ts">
  import { SessionsOverDays } from '@ayola/stats-visualizer';
  import type { SessionData, ChartConfig } from '@ayola/stats-visualizer';

  const sessions: SessionData[] = [
    { id: '1', taskId: 'task-1', rating: 4, duration: 60, date: '2024-12-08' },
    { id: '2', taskId: 'task-1', rating: 5, duration: 45, date: '2024-12-07' },
    // ... more sessions
  ];

  const config: ChartConfig = { title: 'Study Sessions', theme: 'light' };
</script>

<SessionsOverDays data={sessions} {config} />
```

### 3. Done! 🎉
That's all you need. Chart renders with responsive design, light/dark theme, and interactivity built-in.

---

## Features

- ✨ **5 Pre-built Chart Components** - No design work needed
- 📊 **7 Data Utility Functions** - Transform raw data in seconds
- 🎨 **Automatic Theme Support** - Light/dark modes with system detection
- 📱 **100% Responsive** - Mobile-first, works on all devices
- ⚙️ **Zero Configuration** - Smart defaults, override only what you need
- 🎯 **Full TypeScript Support** - Type-safe components and utilities
- 🧪 **32 Unit Tests** - Production-grade reliability
- 📦 **Lightweight** - Minimal dependencies, tree-shakeable exports

## Installation Options

### NPM (Recommended)
```bash
npm install @ayola/stats-visualizer
```

### From GitHub
```bash
npm install git+https://github.com/OlawoleAbayomi-Owodunni/RWM_P2_2025_Olawole_Abayomi-Owodunni.git
```

### Monorepo (Development)
```bash
cd packages/stats-visualizer
npm install
```

## Chart Components

## Chart Components

All components accept data and optional configuration. They're fully responsive and work great on any device.

### 1. SessionsOverDays
**Line/area chart** showing session frequency trends over time. Perfect for visualizing consistency and activity patterns.

```svelte
<script>
  import { SessionsOverDays } from '@ayola/stats-visualizer';
  
  const sessions = [
    { id: '1', taskId: 'task-1', rating: 4, duration: 60, date: '2024-12-01' },
    { id: '2', taskId: 'task-1', rating: 5, duration: 45, date: '2024-12-02' },
    // ...
  ];
</script>

<SessionsOverDays data={sessions} config={{ title: 'Sessions This Month' }} />
```

**Props:**
- `data: SessionData[]` - Array of session records
- `config?: ChartConfig` - Optional styling/behavior configuration

---

### 2. AvgRatingPerTask
**Bar chart** comparing average ratings across different tasks. Click on bars to see session details in a modal.

```svelte
<script>
  import { AvgRatingPerTask } from '@ayola/stats-visualizer';
  
  const sessions = [...]; // Your session data
  const tasks = [...]; // Your task metadata
</script>

<AvgRatingPerTask {sessions} {tasks} config={{ title: 'Average Rating by Task' }} />
```

**Features:**
- Interactive bars with click-to-modal details
- Automatic color coding by rating
- Task name labels and average display

---

### 3. SessionRatingsPerTask
**Stacked bar chart** showing all ratings for each task. Great for understanding rating distribution.

```svelte
<SessionRatingsPerTask {sessions} {tasks} config={{ title: 'Session Ratings' }} />
```

---

### 4. TasksPerMonth
**Bar chart** displaying task completion trends month-over-month with abbreviated month labels.

```svelte
<TasksPerMonth data={sessions} config={{ title: 'Tasks Completed Monthly' }} />
```

---

### 5. DailyStreakTracker
**Visual streak counter** showing current streak, longest streak, and calendar heatmap of activity.

```svelte
<DailyStreakTracker data={sessions} config={{ title: 'Your Streak' }} />
```

**Displays:**
- Current streak (consecutive days)
- Longest streak (all-time record)
- Historical streak details

---

## Data Utilities

### Import Utilities
```typescript
import {
  aggregateSessionsByDay,
  aggregateByWeek,
  aggregateByMonth,
  getAverageRatingPerTask,
  calculateDailyStreak,
  filterByDateRange,
  getTaskSessions
} from '@ayola/stats-visualizer';
```

### Function Reference

#### `aggregateSessionsByDay(sessions)`
Groups sessions by calendar date. Perfect for day-by-day analysis.

```typescript
const byDay = aggregateSessionsByDay(sessions);
// ✅ Returns: { '2024-12-08': [session1, session2], '2024-12-07': [...] }

// Use it: Display one chart per day, compare daily metrics, etc.
Object.entries(byDay).forEach(([date, daySessions]) => {
  console.log(`${date}: ${daySessions.length} sessions`);
});
```

---

#### `aggregateByWeek(sessions): WeeklyStats[]`
Aggregates into weekly summaries with stats.

```typescript
const weeks = aggregateByWeek(sessions);
// ✅ Returns: 
// [
//   { 
//     week: 'Week 49, 2024',
//     totalSessions: 12,
//     tasksCompleted: 5,
//     averageRating: 4.2
//   },
//   ...
// ]

// Use it: Show weekly performance dashboard, compare weeks, etc.
weeks.forEach(week => {
  console.log(`${week.week}: ${week.totalSessions} sessions, avg rating ${week.averageRating}`);
});
```

---

#### `aggregateByMonth(sessions): MonthlyStats[]`
Aggregates into monthly summaries.

```typescript
const months = aggregateByMonth(sessions);
// ✅ Returns:
// [
//   { 
//     month: 'December 2024',
//     totalSessions: 40,
//     tasksCompleted: 15,
//     averageRating: 4.1
//   },
//   ...
// ]
```

---

#### `getAverageRatingPerTask(sessions): Record<string, number>`
Calculates average rating for each task.

```typescript
const avgRatings = getAverageRatingPerTask(sessions);
// ✅ Returns: { 'task-1': 4.5, 'task-2': 3.8, 'task-3': 4.2 }

// Use it: Rank tasks by difficulty/satisfaction, identify problem areas
Object.entries(avgRatings).sort((a, b) => b[1] - a[1]).forEach(([taskId, rating]) => {
  console.log(`${taskId}: ${rating}/5`);
});
```

---

#### `calculateDailyStreak(sessions)`
Calculates current and longest streak with details.

```typescript
const streak = calculateDailyStreak(sessions);
// ✅ Returns:
// {
//   currentStreak: 7,
//   longestStreak: 23,
//   details: [
//     { date: Date, hasSession: true, sessionCount: 2, rating: 4.5 },
//     { date: Date, hasSession: false, sessionCount: 0, rating: undefined },
//     ...
//   ]
// }

// Use it: Gamification, motivation tracking, habit formation analysis
console.log(`🔥 Current streak: ${streak.currentStreak} days`);
console.log(`🏆 Best streak: ${streak.longestStreak} days`);
```

---

#### `filterByDateRange(sessions, startDate, endDate): SessionData[]`
Filters sessions within a date range (inclusive).

```typescript
const recent = filterByDateRange(
  sessions,
  new Date('2024-12-01'),
  new Date('2024-12-08')
);
// ✅ Returns: Only sessions between those dates

// Use it: Date range filtering, report generation, time-period analysis
const thisMonth = filterByDateRange(sessions, monthStart, monthEnd);
console.log(`${thisMonth.length} sessions this month`);
```

---

#### `getTaskSessions(sessions, taskId): SessionData[]`
Gets all sessions for a specific task.

```typescript
const taskSessions = getTaskSessions(sessions, 'task-123');
// ✅ Returns: All sessions where taskId === 'task-123'

// Use it: Task-specific analysis, drill-down views, task performance
const stats = {
  total: taskSessions.length,
  avgRating: taskSessions.reduce((sum, s) => sum + s.rating, 0) / taskSessions.length,
  totalDuration: taskSessions.reduce((sum, s) => sum + s.duration, 0)
};
```

---

## Type Definitions

## Type Definitions

All types are exported and can be imported for full TypeScript support.

```typescript
import type {
  SessionData,
  TaskData,
  ChartConfig,
  WeeklyStats,
  MonthlyStats,
  DailyStreak
} from '@ayola/stats-visualizer';
```

### SessionData
Represents a single work session with metrics.

```typescript
interface SessionData {
  id: string;              // Unique identifier
  taskId: string;          // Reference to a task
  rating: number;          // 1-5 star rating
  duration: number;        // Session duration in minutes
  date: Date | string;     // Session date (ISO string or Date object)
  notes?: string;          // Optional session notes
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

**Example:**
```typescript
const session: SessionData = {
  id: 'sess-1',
  taskId: 'task-reading',
  rating: 5,
  duration: 45,
  date: '2024-12-08',
  notes: 'Great focus session'
};
```

---

### TaskData
Represents a task with optional session history.

```typescript
interface TaskData {
  id: string;              // Unique task identifier
  title: string;           // Task name
  description?: string;    // Optional description
  sessions?: SessionData[]; // Related sessions
  totalSessions?: number;  // Session count
  averageRating?: number;  // Average rating
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

**Example:**
```typescript
const task: TaskData = {
  id: 'task-reading',
  title: 'Daily Reading',
  description: 'Read 30 minutes per day',
  averageRating: 4.2,
  totalSessions: 15
};
```

---

### ChartConfig
Configuration object for chart styling and behavior.

```typescript
interface ChartConfig {
  title?: string;          // Chart title (displays at top)
  theme?: 'light' | 'dark'; // Color theme
  responsive?: boolean;    // Enable responsive sizing
  height?: number;         // Chart height in pixels
  width?: number;          // Chart width in pixels
  showLegend?: boolean;    // Show legend on chart
  dateRange?: {
    startDate: Date | string;
    endDate: Date | string;
  };
}
```

**Example - Default (No Config Needed):**
```typescript
<SessionsOverDays data={sessions} />
// ✅ Auto-detects theme, responsive by default
```

**Example - Custom Config:**
```typescript
<SessionsOverDays data={sessions} config={{
  title: 'Q4 Study Progress',
  theme: 'dark',
  height: 300,
  responsive: true
}} />
```

---

### WeeklyStats
Aggregated statistics for a single week.

```typescript
interface WeeklyStats {
  week: string;            // e.g., "Week 49, 2024"
  totalSessions: number;   // Total sessions that week
  tasksCompleted: number;  // Count of unique tasks
  averageRating: number;   // Average rating (1-5)
}
```

---

### MonthlyStats
Aggregated statistics for a single month.

```typescript
interface MonthlyStats {
  month: string;           // e.g., "December 2024"
  totalSessions: number;   // Total sessions that month
  tasksCompleted: number;  // Count of unique tasks
  averageRating: number;   // Average rating (1-5)
}
```

---

### DailyStreak
Streak calculation result with detailed breakdown.

```typescript
interface DailyStreak {
  currentStreak: number;   // Consecutive days (from today backwards)
  longestStreak: number;   // Best streak ever
  details: Array<{
    date: Date;
    hasSession: boolean;
    sessionCount: number;
    rating?: number;       // Average rating if sessions exist
  }>;
}
```

---

## Real-World Examples

### Example 1: Dashboard with Multiple Charts
```svelte
<script lang="ts">
  import { 
    SessionsOverDays, 
    AvgRatingPerTask, 
    DailyStreakTracker,
    aggregateByWeek 
  } from '@ayola/stats-visualizer';
  import type { SessionData, TaskData, ChartConfig } from '@ayola/stats-visualizer';

  // Your data
  let sessions: SessionData[] = [...];
  let tasks: TaskData[] = [...];

  // Configuration
  const dashConfig: ChartConfig = {
    theme: 'light',
    responsive: true
  };

  $: weeklyStats = aggregateByWeek(sessions);
</script>

<div class="dashboard">
  <h1>Study Analytics</h1>
  
  <div class="chart-grid">
    <SessionsOverDays data={sessions} config={dashConfig} />
    <AvgRatingPerTask {sessions} {tasks} config={dashConfig} />
    <DailyStreakTracker data={sessions} config={dashConfig} />
  </div>

  <div class="stats">
    {#each weeklyStats as week}
      <div class="week-card">
        <h3>{week.week}</h3>
        <p>Sessions: {week.totalSessions}</p>
        <p>Average Rating: {week.averageRating.toFixed(1)}/5</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .dashboard { padding: 2rem; }
  .chart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
</style>
```

---

### Example 2: Task-Specific Analysis
```svelte
<script lang="ts">
  import { 
    getTaskSessions, 
    getAverageRatingPerTask,
    calculateDailyStreak 
  } from '@ayola/stats-visualizer';
  import type { SessionData } from '@ayola/stats-visualizer';

  export let taskId: string;
  export let allSessions: SessionData[];

  // Get only this task's sessions
  $: taskSessions = getTaskSessions(allSessions, taskId);
  $: taskStats = {
    total: taskSessions.length,
    avgRating: taskSessions.length ? 
      taskSessions.reduce((sum, s) => sum + s.rating, 0) / taskSessions.length : 0,
    totalMinutes: taskSessions.reduce((sum, s) => sum + s.duration, 0)
  };
</script>

<div class="task-analysis">
  <h2>Task #{taskId}</h2>
  <dl>
    <dt>Sessions:</dt>
    <dd>{taskStats.total}</dd>
    <dt>Average Rating:</dt>
    <dd>{taskStats.avgRating.toFixed(1)}/5 ⭐</dd>
    <dt>Total Time:</dt>
    <dd>{(taskStats.totalMinutes / 60).toFixed(1)} hours</dd>
  </dl>
</div>
```

---

### Example 3: Date Range Filtering
```svelte
<script lang="ts">
  import { SessionsOverDays, filterByDateRange } from '@ayola/stats-visualizer';
  import type { SessionData, ChartConfig } from '@ayola/stats-visualizer';

  export let sessions: SessionData[];
  let startDate = new Date();
  let endDate = new Date();

  // User can pick dates
  $: filtered = filterByDateRange(sessions, startDate, endDate);
  
  const config: ChartConfig = {
    title: `Sessions: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  };
</script>

<div>
  <label>
    Start: <input type="date" bind:value={startDate} />
  </label>
  <label>
    End: <input type="date" bind:value={endDate} />
  </label>

  <SessionsOverDays data={filtered} {config} />
</div>
```

---

## Customization

### Theme Support
Charts automatically detect system theme preference but can be overridden:

```svelte
<!-- Auto-detect system theme -->
<SessionsOverDays data={sessions} />

<!-- Force light theme -->
<SessionsOverDays data={sessions} config={{ theme: 'light' }} />

<!-- Force dark theme -->
<SessionsOverDays data={sessions} config={{ theme: 'dark' }} />
```

### Responsive Design
All components are responsive by default. Use `config.height` and `config.width` for custom sizing:

```svelte
<!-- Full responsive (default) -->
<SessionsOverDays data={sessions} />

<!-- Fixed size -->
<SessionsOverDays data={sessions} config={{ height: 400, width: 600 }} />

<!-- Mobile-specific -->
<SessionsOverDays data={sessions} config={{ height: 250, width: 300 }} />
```

---

## Integration with P1 Activity Tracker

The component library works seamlessly with P1 Activity Tracker data:

```typescript
// From P1 API
const response = await fetch('/api/sessions');
const sessions = await response.json();

// Use directly with components
export let sessions;
```

No data transformation needed - just pass raw session data!

---

## Testing

The library includes 32 comprehensive unit tests:

```bash
cd packages/stats-visualizer
npm test              # Run tests
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

All utilities are fully tested for reliability.

---

## Development

### Build
```bash
npm run build        # Create production build
npm run dev         # Watch mode
```

### Structure
```
packages/stats-visualizer/
├── src/
│   ├── charts/          # 5 Svelte components
│   ├── utils/           # 7 utility functions
│   ├── types.ts         # TypeScript definitions
│   └── index.ts         # Main exports
├── README.md            # This file
└── package.json
```

---

## Troubleshooting

### Data not showing?
- Ensure `date` field is valid ISO string or Date object
- Check that `sessionId` and `taskId` are unique
- Verify data array is not empty

### Theme not working?
- Component respects CSS custom properties
- Ensure parent element allows style application

### Performance issues?
- Limit data to last 90 days for best performance
- Use `filterByDateRange()` to reduce dataset
- Components automatically virtualize large datasets

---

## License

MIT

---

## Support

For issues, questions, or contributions:
- 📝 Check [demo app](./demo) for working examples
- 🧪 Run tests: `npm test`
- 📚 Review component source code in `src/charts/`
