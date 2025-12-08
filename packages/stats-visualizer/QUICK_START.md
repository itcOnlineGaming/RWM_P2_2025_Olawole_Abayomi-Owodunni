# Quick Start Guide

Get a chart up and running in **less than 5 minutes**.

## Step 1: Install (30 seconds)
```bash
npm install @ayola/stats-visualizer
```

## Step 2: Add to Your Svelte Component (1 minute)
```svelte
<script lang="ts">
  import { SessionsOverDays } from '@ayola/stats-visualizer';
  import type { SessionData } from '@ayola/stats-visualizer';

  // Your data
  const sessions: SessionData[] = [
    { id: '1', taskId: 'reading', rating: 5, duration: 45, date: '2024-12-08' },
    { id: '2', taskId: 'reading', rating: 4, duration: 60, date: '2024-12-07' },
  ];
</script>

<!-- That's it! -->
<SessionsOverDays data={sessions} config={{ title: 'My Sessions' }} />
```

## Step 3: Run Your App
```bash
npm run dev
```

Done! 🎉

---

## All 5 Charts (Copy & Paste)

```svelte
<script lang="ts">
  import { 
    SessionsOverDays, 
    AvgRatingPerTask, 
    SessionRatingsPerTask,
    TasksPerMonth,
    DailyStreakTracker 
  } from '@ayola/stats-visualizer';
  import type { SessionData, TaskData } from '@ayola/stats-visualizer';

  const sessions: SessionData[] = [...]; // your data
  const tasks: TaskData[] = [...];       // your tasks
</script>

<div class="charts">
  <SessionsOverDays data={sessions} />
  <AvgRatingPerTask {sessions} {tasks} />
  <SessionRatingsPerTask {sessions} {tasks} />
  <TasksPerMonth data={sessions} />
  <DailyStreakTracker data={sessions} />
</div>

<style>
  .charts { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; }
</style>
```

---

## All 7 Utilities (Reference)

```typescript
import {
  aggregateSessionsByDay,    // Group by date
  aggregateByWeek,           // Group by week
  aggregateByMonth,          // Group by month
  getAverageRatingPerTask,   // Get avg rating per task
  calculateDailyStreak,      // Get streak info
  filterByDateRange,         // Filter by dates
  getTaskSessions            // Get sessions for 1 task
} from '@ayola/stats-visualizer';

// Examples
const byDay = aggregateSessionsByDay(sessions);
const weeks = aggregateByWeek(sessions);
const months = aggregateByMonth(sessions);
const taskRatings = getAverageRatingPerTask(sessions);
const streak = calculateDailyStreak(sessions);
const recent = filterByDateRange(sessions, startDate, endDate);
const taskSessions = getTaskSessions(sessions, 'task-id');
```

---

## Common Patterns

### Theme Control
```svelte
<!-- Auto theme (recommended) -->
<SessionsOverDays data={sessions} />

<!-- Light mode -->
<SessionsOverDays data={sessions} config={{ theme: 'light' }} />

<!-- Dark mode -->
<SessionsOverDays data={sessions} config={{ theme: 'dark' }} />
```

### Custom Size
```svelte
<SessionsOverDays 
  data={sessions} 
  config={{ height: 400, width: 600 }} 
/>
```

### With Title
```svelte
<SessionsOverDays 
  data={sessions} 
  config={{ title: 'Study Progress' }} 
/>
```

---

## Data Format

```typescript
interface SessionData {
  id: string;           // Unique ID
  taskId: string;       // Task reference
  rating: number;       // 1-5 stars
  duration: number;     // Minutes
  date: Date | string;  // ISO string or Date
}
```

That's literally all you need to know!

---

## Need More?

- 📖 Full docs: See [README.md](README.md)
- 🧪 Tests: `npm test`
- 💬 Examples: Check [demo app](../demo)
