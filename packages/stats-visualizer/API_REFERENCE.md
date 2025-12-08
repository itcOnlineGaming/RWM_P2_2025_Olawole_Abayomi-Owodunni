# API Reference

Complete documentation for all components and utilities.

## Components

### SessionsOverDays

Line/area chart showing session frequency over time.

**Props:**
```typescript
data: SessionData[]                    // Array of sessions
config?: ChartConfig                   // Optional configuration
```

**Example:**
```svelte
<SessionsOverDays 
  data={sessions} 
  config={{ title: 'Sessions Over Time' }} 
/>
```

**Best for:**
- Visualizing activity trends
- Identifying busy periods
- Consistency tracking

---

### AvgRatingPerTask

Bar chart comparing average ratings across tasks. **Interactive** - click bars to see session details.

**Props:**
```typescript
sessions: SessionData[]                // All sessions
tasks: TaskData[]                      // Task metadata
config?: ChartConfig                   // Optional configuration
```

**Example:**
```svelte
<AvgRatingPerTask 
  {sessions} 
  {tasks}
  config={{ title: 'Rating by Task' }} 
/>
```

**Features:**
- Color-coded by rating
- Click for modal details
- Task names displayed

---

### SessionRatingsPerTask

Stacked bar chart showing all ratings for each task.

**Props:**
```typescript
sessions: SessionData[]
tasks: TaskData[]
config?: ChartConfig
```

**Example:**
```svelte
<SessionRatingsPerTask {sessions} {tasks} />
```

**Best for:**
- Rating distribution analysis
- Quality consistency
- Task difficulty assessment

---

### TasksPerMonth

Bar chart showing task completion trends month-over-month.

**Props:**
```typescript
data: SessionData[]
config?: ChartConfig
```

**Example:**
```svelte
<TasksPerMonth 
  data={sessions}
  config={{ title: 'Monthly Progress' }} 
/>
```

---

### DailyStreakTracker

Visual streak display with current, longest, and historical breakdown.

**Props:**
```typescript
data: SessionData[]
config?: ChartConfig
```

**Example:**
```svelte
<DailyStreakTracker 
  data={sessions}
  config={{ title: 'Your Streak' }} 
/>
```

**Displays:**
- 🔥 Current streak
- 🏆 Longest streak
- 📅 Calendar details

---

## Utility Functions

### aggregateSessionsByDay

**Purpose:** Group sessions by calendar date

**Signature:**
```typescript
function aggregateSessionsByDay(sessions: SessionData[]): Record<string, SessionData[]>
```

**Parameters:**
- `sessions` - Array of session records

**Returns:**
Object with date strings as keys, session arrays as values

**Example:**
```typescript
const byDay = aggregateSessionsByDay(sessions);
// {
//   '2024-12-08': [session1, session2],
//   '2024-12-07': [session3],
//   ...
// }

// Use cases
for (const [date, daySessions] of Object.entries(byDay)) {
  console.log(`${date}: ${daySessions.length} sessions`);
}
```

**Performance:** O(n) linear time

---

### aggregateByWeek

**Purpose:** Group sessions into weekly summaries with aggregated stats

**Signature:**
```typescript
function aggregateByWeek(sessions: SessionData[]): WeeklyStats[]
```

**Returns:**
```typescript
[
  {
    week: string;              // e.g., "Week 49, 2024"
    totalSessions: number;
    tasksCompleted: number;
    averageRating: number;
  },
  ...
]
```

**Example:**
```typescript
const weeks = aggregateByWeek(sessions);

weeks.forEach(week => {
  console.log(`${week.week}:`);
  console.log(`  Sessions: ${week.totalSessions}`);
  console.log(`  Tasks: ${week.tasksCompleted}`);
  console.log(`  Avg Rating: ${week.averageRating.toFixed(1)}/5`);
});
```

**Week Definition:** Monday - Sunday (ISO standard)

---

### aggregateByMonth

**Purpose:** Group sessions into monthly summaries

**Signature:**
```typescript
function aggregateByMonth(sessions: SessionData[]): MonthlyStats[]
```

**Returns:**
```typescript
[
  {
    month: string;             // e.g., "December 2024"
    totalSessions: number;
    tasksCompleted: number;
    averageRating: number;
  },
  ...
]
```

**Example:**
```typescript
const months = aggregateByMonth(sessions);

months.sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
// Most recent month first
```

---

### getAverageRatingPerTask

**Purpose:** Calculate average rating for each task

**Signature:**
```typescript
function getAverageRatingPerTask(sessions: SessionData[]): Record<string, number>
```

**Returns:**
Object with task IDs as keys, average ratings (1-5) as values

**Example:**
```typescript
const avgRatings = getAverageRatingPerTask(sessions);

// Rank tasks by difficulty (lowest rating = hardest)
const ranked = Object.entries(avgRatings)
  .sort((a, b) => a[1] - b[1])
  .map(([taskId, rating]) => ({ taskId, rating }));

ranked.forEach(({ taskId, rating }) => {
  console.log(`${taskId}: ${rating.toFixed(1)}/5`);
});
```

**Rounding:** Result rounded to 1 decimal place

---

### calculateDailyStreak

**Purpose:** Calculate current streak, longest streak, and detailed history

**Signature:**
```typescript
function calculateDailyStreak(sessions: SessionData[]): {
  currentStreak: number;
  longestStreak: number;
  details: DailyStreak[];
}
```

**Returns:**
```typescript
{
  currentStreak: number,    // Consecutive days from today
  longestStreak: number,    // Best streak ever
  details: [
    {
      date: Date,
      hasSession: boolean,
      sessionCount: number,
      rating?: number       // Avg rating if has sessions
    },
    ...
  ]
}
```

**Example:**
```typescript
const streak = calculateDailyStreak(sessions);

console.log(`🔥 Current streak: ${streak.currentStreak} days`);
console.log(`🏆 Best streak: ${streak.longestStreak} days`);

// Motivation check
if (streak.currentStreak === 0 && streak.longestStreak > 0) {
  console.log('Get back on track! You were at ' + streak.longestStreak + ' days!');
}
```

**History:** Last 365 days from today

---

### filterByDateRange

**Purpose:** Filter sessions within a date range (inclusive)

**Signature:**
```typescript
function filterByDateRange(
  sessions: SessionData[], 
  startDate: Date, 
  endDate: Date
): SessionData[]
```

**Parameters:**
- `sessions` - All sessions to filter
- `startDate` - Start of range (inclusive)
- `endDate` - End of range (inclusive)

**Returns:** Array of sessions within range

**Example:**
```typescript
// Last 7 days
const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const recentSessions = filterByDateRange(sessions, weekAgo, today);

// Specific month
const start = new Date('2024-12-01');
const end = new Date('2024-12-31');
const decemberSessions = filterByDateRange(sessions, start, end);
```

**Performance:** O(n) linear time

---

### getTaskSessions

**Purpose:** Get all sessions for a specific task

**Signature:**
```typescript
function getTaskSessions(sessions: SessionData[], taskId: string): SessionData[]
```

**Parameters:**
- `sessions` - All sessions
- `taskId` - Task to filter for

**Returns:** Sessions matching that taskId

**Example:**
```typescript
const readingSessions = getTaskSessions(sessions, 'task-reading');

// Calculate task statistics
const taskStats = {
  total: readingSessions.length,
  avgRating: readingSessions.length 
    ? readingSessions.reduce((sum, s) => sum + s.rating, 0) / readingSessions.length
    : 0,
  totalMinutes: readingSessions.reduce((sum, s) => sum + s.duration, 0)
};

console.log(`Task: ${taskStats.total} sessions, ${taskStats.avgRating.toFixed(1)}/5`);
```

---

## Type Definitions

### SessionData
```typescript
interface SessionData {
  id: string;              // Unique identifier (required)
  taskId: string;          // Task reference (required)
  rating: number;          // 1-5 star rating (required)
  duration: number;        // Minutes (required)
  date: Date | string;     // ISO string or Date object (required)
  notes?: string;          // Optional notes
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

**Validation:**
- `rating` must be 1-5
- `duration` must be positive
- `date` must be valid ISO string or Date
- `id` and `taskId` must be unique strings

---

### TaskData
```typescript
interface TaskData {
  id: string;              // Unique identifier (required)
  title: string;           // Display name (required)
  description?: string;
  sessions?: SessionData[];
  totalSessions?: number;  // Computed
  averageRating?: number;  // Computed
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

---

### ChartConfig
```typescript
interface ChartConfig {
  title?: string;                    // Chart title
  theme?: 'light' | 'dark';         // Color scheme
  responsive?: boolean;              // Auto-responsive (default true)
  height?: number;                   // px (overrides responsive)
  width?: number;                    // px (overrides responsive)
  showLegend?: boolean;              // Show chart legend
  dateRange?: {
    startDate: Date | string;
    endDate: Date | string;
  };
}
```

---

### WeeklyStats
```typescript
interface WeeklyStats {
  week: string;            // e.g., "Week 49, 2024"
  totalSessions: number;
  tasksCompleted: number;  // Unique task count
  averageRating: number;   // 1-5
}
```

---

### MonthlyStats
```typescript
interface MonthlyStats {
  month: string;           // e.g., "December 2024"
  totalSessions: number;
  tasksCompleted: number;  // Unique task count
  averageRating: number;   // 1-5
}
```

---

### DailyStreak
```typescript
interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  details: Array<{
    date: Date;
    hasSession: boolean;
    sessionCount: number;
    rating?: number;  // Average rating if hasSession
  }>;
}
```

---

## Error Handling

### Common Issues

**Empty data array**
```typescript
// Components handle gracefully
<SessionsOverDays data={[]} />  // Shows empty chart

// Utilities return safe defaults
aggregateByWeek([]);            // Returns []
calculateDailyStreak([]);       // Returns { currentStreak: 0, longestStreak: 0, details: [] }
```

**Invalid dates**
```typescript
// ISO strings work best
{ date: '2024-12-08' }          // ✅ Works
{ date: new Date('2024-12-08')} // ✅ Works
{ date: '12/08/2024' }          // ❌ May fail - use ISO format
```

**Missing required fields**
```typescript
// Will cause errors - make sure all required fields exist
const session: SessionData = {
  id: 'sess-1',
  taskId: 'task-1',
  rating: 4,
  duration: 60,
  date: '2024-12-08'
  // All required ✅
};
```

---

## Performance Notes

- **Large datasets:** Tested with 1000+ sessions
- **Real-time updates:** All utilities re-run on data change (reactive)
- **Memory:** Utilities are stateless, no memory leaks
- **Rendering:** Components use virtual scrolling for large charts

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Chart not showing | Verify data array is not empty |
| Wrong dates in output | Use ISO format (YYYY-MM-DD) for date strings |
| Theme not applying | Ensure parent has CSS support for CSS variables |
| Performance slow | Filter data to last 90 days using `filterByDateRange()` |
| TypeScript errors | Import types: `import type { SessionData } from '@ayola/stats-visualizer'` |

---

## Examples

See [demo app](../demo) for working examples of all components and utilities.
