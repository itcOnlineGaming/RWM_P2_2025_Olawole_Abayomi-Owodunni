# RWM P2 Project - Stats Visualizer Component Library

**Production-ready reusable Svelte component library** for visualizing activity tracking statistics. Build beautiful, responsive analytics dashboards with 5 pre-built chart types and 7 powerful data utility functions.

## What's Inside

This is a **monorepo** with two main packages:

### 1. [@ayola/stats-visualizer](./packages/stats-visualizer)
The core component library with everything you need to visualize activity data.

**Features:**
- 5 chart components (SessionsOverDays, AvgRatingPerTask, SessionRatingsPerTask, TasksPerMonth, DailyStreakTracker)
- 7 data utility functions (aggregate, filter, calculate streaks)
- Full TypeScript support with type definitions
- Light/dark theme support with system detection
- 100% responsive design (mobile-first)
- 32 comprehensive unit tests

**Quick Install:**
```bash
npm install @ayola/stats-visualizer
```

### 2. [Demo App](./demo)
Interactive showcase of all components with real-time data generation and filtering.

**Quick Start:**
```bash
cd demo
npm install
npm run dev
```

## Quick Start (Choose Your Path)

### Path 1: I Just Want to Use It (5 minutes)
1. **Install:** `npm install @ayola/stats-visualizer`
2. **Import:** `import { SessionsOverDays } from '@ayola/stats-visualizer'`
3. **Use:** `<SessionsOverDays data={sessions} config={{ title: 'Analytics' }} />`

**Start here:** [Quick Start Guide](./packages/stats-visualizer/QUICK_START.md)

### Path 2: I Want to See a Demo (10 minutes)
1. **Clone/Navigate:** `cd demo`
2. **Install:** `npm install`
3. **Run:** `npm run dev`
4. **Explore:** Open http://localhost:5173

**Continue here:** [Demo App README](./demo/README.md)

### Path 3: I Want to Understand Everything (15 minutes)
1. **Read:** [Main User Guide](./packages/stats-visualizer/README.md)
2. **Learn:** [API Reference](./packages/stats-visualizer/API_REFERENCE.md)
3. **Integrate:** Copy examples from [Real-World Examples](./packages/stats-visualizer/README.md#real-world-examples)

**Start here:** [Full README](./packages/stats-visualizer/README.md)

### Path 4: I Want to Contribute (Developer)
1. **Setup:** `cd packages/stats-visualizer && npm install`
2. **Code:** Follow [Developer Guide](./packages/stats-visualizer/DEVELOPER_GUIDE.md)
3. **Test:** `npm test`
4. **Build:** `npm run build`

**Start here:** [Developer Guide](./packages/stats-visualizer/DEVELOPER_GUIDE.md)

## Documentation

All documentation is organized by audience and use case:

### For Users
| Document | Purpose | Time |
|----------|---------|------|
| [QUICK_START.md](./packages/stats-visualizer/QUICK_START.md) | Get running in 5 minutes | 5 min |
| [README.md](./packages/stats-visualizer/README.md) | Complete user guide with examples | 15 min |
| [API_REFERENCE.md](./packages/stats-visualizer/API_REFERENCE.md) | Detailed API documentation | 20 min |

### For Developers
| Document | Purpose |
|----------|---------|
| [DEVELOPER_GUIDE.md](./packages/stats-visualizer/DEVELOPER_GUIDE.md) | Architecture, testing, contributing |
| [Demo App README](./demo/README.md) | Running and customizing the demo |

## Key Features

### 5 Chart Components
- **SessionsOverDays** - Line chart of session frequency
- **AvgRatingPerTask** - Bar chart with click-to-modal details
- **SessionRatingsPerTask** - Stacked bar showing rating distribution
- **TasksPerMonth** - Monthly completion tracking
- **DailyStreakTracker** - Streak display with history

### 7 Utility Functions
```typescript
import {
  aggregateSessionsByDay,    // Group by date
  aggregateByWeek,           // Group by week
  aggregateByMonth,          // Group by month
  getAverageRatingPerTask,   // Avg rating per task
  calculateDailyStreak,      // Streak calculations
  filterByDateRange,         // Filter by dates
  getTaskSessions            // Get task sessions
} from '@ayola/stats-visualizer';
```

### Design & UX
- Light/dark theme with system detection
- 100% responsive (mobile, tablet, desktop)
- Zero configuration required
- Type-safe TypeScript support
- Accessible markup
- **NEW:** Mobile-first bottom navigation
- **NEW:** Time-advancement playground for testing
- **NEW:** Session & task creation modals

### Data Management
- **NEW:** localStorage persistence for sessions and tasks
- **NEW:** App time system for testing time-dependent features
- 7 aggregation utilities for data transformation

### Quality & Reliability
- 56 unit tests (utilities + components + modals + time system)
- Production-ready code
- Optimized for performance
- Comprehensive documentation

## Project Structure

```
rwm_p2_project/
├── packages/
│   └── stats-visualizer/              # Main component library
│       ├── src/
│       │   ├── charts/                # 5 Svelte components
│       │   ├── utils/                 # 7 utility functions
│       │   ├── types.ts               # TypeScript interfaces
│       │   └── index.ts               # Main exports
│       ├── README.md                  # User guide (main doc)
│       ├── QUICK_START.md            # 5-minute setup
│       ├── API_REFERENCE.md          # Detailed API docs
│       ├── DEVELOPER_GUIDE.md        # Developer documentation
│       └── vitest.config.ts          # Test configuration
│
├── demo/                              # Interactive demo app
│   ├── src/
│   │   ├── routes/+page.svelte       # Main demo page
│   │   ├── lib/utils.ts              # Data generation
│   │   └── app.css                   # Styles
│   └── README.md                     # Demo documentation
│
├── .storybook/                        # Storybook config (optional)
└── README.md                          # This file
```

## Development

### Setup
```bash
# Install dependencies
npm install

# Navigate to component library
cd packages/stats-visualizer

# Install library dependencies
npm install
```

### Commands

```bash
# Development
npm run dev              # Watch mode for development

# Testing
npm test                 # Run all tests
npm run test:ui         # Interactive test UI
npm run test:coverage   # Generate coverage report

# Building
npm run build           # Production build

# Linting
npm run lint            # Check code quality
```

### Running Demo
```bash
cd demo
npm install
npm run dev
# Open http://localhost:5173
```

## Testing

### Test Coverage
- **types.test.ts**: 12 tests for TypeScript type definitions
- **aggregation.test.ts**: 20 tests for all 7 utility functions

### Run Tests
```bash
cd packages/stats-visualizer
npm test              # All tests
npm run test:ui       # Interactive UI
npm run test:coverage # Coverage report
```

### Test Results
```
Test Files  2 passed (2)
      Tests  32 passed (32)
   Start at  04:40:10
   Duration  1.60s
```

✅ **All 32 tests passing!**

## Learning Path

### Beginner - "I want to use the charts"
1. Read [QUICK_START.md](./packages/stats-visualizer/QUICK_START.md)
2. Copy the example code
3. Run the demo app to see it working

### Intermediate - "I want to understand the data flow"
1. Read [README.md](./packages/stats-visualizer/README.md)
2. Review the [Real-World Examples](./packages/stats-visualizer/README.md#real-world-examples)
3. Look at the [demo app source](./demo/src/routes/+page.svelte)

### Advanced - "I want to extend or contribute"
1. Read [DEVELOPER_GUIDE.md](./packages/stats-visualizer/DEVELOPER_GUIDE.md)
2. Review the [API Reference](./packages/stats-visualizer/API_REFERENCE.md)
3. Check the component and utility source code
4. Write tests and submit PR

## Use Cases

### Activity Tracker Dashboard
Visualize daily sessions, track ratings, and monitor streaks:
```svelte
<SessionsOverDays data={sessions} />
<DailyStreakTracker data={sessions} />
<AvgRatingPerTask {sessions} {tasks} />
```

### Performance Analysis
Compare task performance and identify patterns:
```typescript
const avgRatings = getAverageRatingPerTask(sessions);
const weeklyStats = aggregateByWeek(sessions);
```

### Productivity Tracking
Monitor monthly completion and consistency:
```svelte
<TasksPerMonth data={sessions} />
```

### Custom Analytics
Build anything with the utility functions:
```typescript
const recent = filterByDateRange(sessions, startDate, endDate);
const taskData = getTaskSessions(sessions, 'task-id');
const streak = calculateDailyStreak(sessions);
```

## Integration

### With SvelteKit
```svelte
<script lang="ts">
  import { SessionsOverDays } from '@ayola/stats-visualizer';
</script>

<SessionsOverDays data={sessions} />
```

### With Other Frameworks
The component library exports utilities that work anywhere:
```typescript
import { aggregateByWeek } from '@ayola/stats-visualizer';
const weeks = aggregateByWeek(sessions); // Use anywhere
```

## Support

### Documentation
- [README](./packages/stats-visualizer/README.md) - Main guide
- [Quick Start](./packages/stats-visualizer/QUICK_START.md) - 5-minute setup
- [API Reference](./packages/stats-visualizer/API_REFERENCE.md) - Complete API
- [Developer Guide](./packages/stats-visualizer/DEVELOPER_GUIDE.md) - Contributing

### Examples
- [Demo App](./demo) - Interactive showcase
- [Real-World Examples](./packages/stats-visualizer/README.md#real-world-examples) - Code samples

### Testing
```bash
cd packages/stats-visualizer
npm test              # Run tests
npm run test:ui       # Visual test runner
```
## Ready to Get Started?

Choose your path:

- **Just want to use it?** -> [Quick Start Guide](./packages/stats-visualizer/QUICK_START.md) (5 min)
- **Want to see it in action?** -> [Demo App](./demo) (10 min)
- **Want to learn everything?** -> [Full README](./packages/stats-visualizer/README.md) (15 min)
- **Want to contribute?** -> [Developer Guide](./packages/stats-visualizer/DEVELOPER_GUIDE.md)
