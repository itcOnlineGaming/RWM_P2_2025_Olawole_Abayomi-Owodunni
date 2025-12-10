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
currentDate?: Date                     // Optional: Use this date for calculations (default: today)
config?: ChartConfig
```

**Example:**
```svelte
<DailyStreakTracker 
  data={sessions}
  currentDate={appTime}
  config={{ title: 'Your Streak' }} 
/>
```

**Displays:**
- 🔥 Current streak
- 🏆 Longest streak
- 📅 Calendar details

**Note:** When `currentDate` is provided, streak calculations are performed relative to that date instead of today. Useful for testing time advancement scenarios.

---

### FlameTracker

Motivational flame indicator showing activity consistency and decay.

**Props:**
```typescript
data: SessionData[]
currentDate?: Date                     // Optional: Use this date for decay calculations (default: today)
```

**Example:**
```svelte
<FlameTracker 
  data={sessions}
  currentDate={appTime}
/>
```

**Features:**
- 4 intensity levels (smolder, small, medium, large)
- Grows with each session
- Decays 15% per missed day
- Minimum smolder at 10%
- Capped at 100% intensity

**Calculation:**
- Base size: 3% per session (capped at 100%)
- Decay: 15% per day since last session
- Minimum: 10% (always visible)

---

### TrophyTracker

Monthly achievement indicator tracking task completions.

**Props:**
```typescript
data: TaskData[]
currentDate?: Date                     // Optional: Use this date for month determination (default: today)
```

**Example:**
```svelte
<TrophyTracker 
  data={tasks}
  currentDate={appTime}
/>
```

**Features:**
- Grows 8% per task completed this month
- Auto-resets at month boundary
- Milestone animations at 25%, 50%, 75%, 100%
- Capped at 100% growth

**Calculation:**
- Base size: 8% per task (capped at 100%)
- Month: Determined by currentDate
- Reset: Automatic when month changes

**Note:** When `currentDate` is provided, the tracker uses that month for filtering tasks. Useful for demonstrating monthly resets.

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
function calculateDailyStreak(
  sessions: SessionData[], 
  currentDate?: Date
): {
  currentStreak: number;
  longestStreak: number;
  details: DailyStreak[];
}
```

**Parameters:**
- `sessions` - Array of session records
- `currentDate` - Optional: Use this date as "today" for calculations (default: actual today)

**Returns:**
```typescript
{
  currentStreak: number,    // Consecutive days from currentDate backwards
  longestStreak: number,    // Best streak in 365-day window
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
// Using today
const streak = calculateDailyStreak(sessions);

// Using specific date (for testing/demo purposes)
const appTime = new Date('2024-12-15');
const streak = calculateDailyStreak(sessions, appTime);

console.log(`🔥 Current streak: ${streak.currentStreak} days`);
console.log(`🏆 Best streak: ${streak.longestStreak} days`);

// Motivation check
if (streak.currentStreak === 0 && streak.longestStreak > 0) {
  console.log('Get back on track! You were at ' + streak.longestStreak + ' days!');
}
```

**History:** Last 365 days from currentDate

**Note:** The optional `currentDate` parameter is useful for:
- Testing streak calculations
- Time-travel debugging
- Demo scenarios with artificial dates
- Historical analysis

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

## Demo App Components

The demo app includes additional UI components for managing sessions, tasks, and time advancement:

### AddSessionModal

Modal form for creating new sessions.

**Location:** `demo/src/components/AddSessionModal`

**Props:**
```typescript
{
  tasks: TaskData[];           // Available tasks for selection
  isOpen: boolean;             // Controls modal visibility
  onClose: () => void;         // Callback when modal closes
  onSubmit: (session) => void; // Callback with new session
}
```

**Form Fields:**
- Task selector (required)
- Date picker (defaults to app time)
- Rating 1-5 slider
- Duration in minutes
- Optional notes textarea

**Example:**
```svelte
<AddSessionModal 
  {tasks}
  {isOpen}
  on:close={closeModal}
  on:submit={handleAddSession}
/>
```

---

### CreateTaskModal

Modal form for creating new tasks.

**Location:** `demo/src/components/CreateTaskModal`

**Props:**
```typescript
{
  isOpen: boolean;             // Controls modal visibility
  onClose: () => void;         // Callback when modal closes
  onSubmit: (task) => void;    // Callback with new task
}
```

**Form Fields:**
- Task title (required)
- Description (optional)
- Completion date (defaults to app time)

**Example:**
```svelte
<CreateTaskModal 
  {isOpen}
  on:close={closeModal}
  on:submit={handleAddTask}
/>
```

---

### MobileNav

Responsive bottom navigation for mobile devices.

**Location:** `demo/src/components/MobileNav`

**Props:**
```typescript
// Component automatically uses $page.url from SvelteKit
// No props required - uses reactive context
```

**Behavior:**
- Hidden on desktop (>640px)
- Visible and fixed at bottom on mobile (<640px)
- Shows Motivation (🔥) and Analytics (📊) links
- Automatically highlights active page

**Example:**
```svelte
<MobileNav />
```

---

## Storage Utility Functions

Demo app includes utilities for managing app state with localStorage persistence.

**Location:** `demo/src/lib/utils/storage.ts`

### saveSessions / getSessions

Persist and retrieve session data.

```typescript
export function saveSessions(sessions: SessionData[]): void
export function getSessions(): SessionData[]
```

**Example:**
```typescript
import { saveSessions, getSessions } from '$lib/utils/storage';

// Save sessions
const sessions = [...];
saveSessions(sessions);

// Retrieve sessions
const restored = getSessions();
```

---

### saveTasks / getTasks

Persist and retrieve task data.

```typescript
export function saveTasks(tasks: TaskData[]): void
export function getTasks(): TaskData[]
```

**Example:**
```typescript
import { saveTasks, getTasks } from '$lib/utils/storage';

saveTasks(tasks);
const restored = getTasks();
```

---

### App Time Management

Functions for managing simulated app time separate from real time.

```typescript
export function getAppTime(): Date
export function setAppTime(date: Date): void
export function advanceAppTime(days: number): Date
```

**Purpose:** Allows testing time-dependent features (flame decay, trophy resets, streaks) without waiting for real time to pass.

**Example:**
```typescript
import { getAppTime, setAppTime, advanceAppTime } from '$lib/utils/storage';

// Set to specific date
setAppTime(new Date('2024-12-15'));

// Get current app time
const now = getAppTime();

// Advance by days
const newDate = advanceAppTime(5);  // Move 5 days forward

// Pass to components for testing
<FlameTracker data={sessions} currentDate={getAppTime()} />
<TrophyTracker data={tasks} currentDate={getAppTime()} />
```

---

### clearStoredData / hasStoredData

Utility functions for data management.

```typescript
export function clearStoredData(): void
export function hasStoredData(): boolean
```

**Example:**
```typescript
import { clearStoredData, hasStoredData } from '$lib/utils/storage';

// Check if data exists
if (hasStoredData()) {
  console.log('Data already stored');
}

// Clear everything
clearStoredData();
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

## Examples

See [demo app](../demo) for working examples of all components and utilities.
