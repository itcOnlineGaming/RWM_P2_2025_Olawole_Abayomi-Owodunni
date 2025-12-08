# Developer Guide

Contributing to @ayola/stats-visualizer

## Project Structure

```
packages/stats-visualizer/
├── src/
│   ├── charts/                 # 5 Svelte components
│   │   ├── SessionsOverDays.svelte
│   │   ├── AvgRatingPerTask.svelte
│   │   ├── SessionRatingsPerTask.svelte
│   │   ├── TasksPerMonth.svelte
│   │   └── DailyStreakTracker.svelte
│   │
│   ├── utils/                  # 7 utility functions
│   │   ├── aggregation.ts      # Core utilities
│   │   ├── aggregation.test.ts # 20 unit tests
│   │   └── index.ts            # Exports
│   │
│   ├── types.ts                # TypeScript interfaces
│   ├── types.test.ts           # 12 type tests
│   └── index.ts                # Main exports
│
├── README.md                   # User guide
├── QUICK_START.md             # 5-minute setup
├── API_REFERENCE.md           # Complete API docs
├── DEVELOPER_GUIDE.md         # This file
│
├── vitest.config.ts           # Test configuration
├── package.json               # Dependencies & scripts
└── tsconfig.json              # TypeScript config
```

## Setup for Development

### Install Dependencies
```bash
cd packages/stats-visualizer
npm install
```

### Commands
```bash
npm run dev        # Watch mode (components & utilities)
npm test           # Run all tests
npm run test:ui    # Interactive test UI
npm run test:coverage  # Coverage report
npm run build      # Production build
npm run lint       # Lint code
```

## Architecture

### Components (Svelte)

Each chart is a standalone Svelte component following this pattern:

```svelte
<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';

  export let data: SessionData[];
  export let config: ChartConfig = {};

  // Computed data
  $: aggregated = aggregateData(data);
  $: theme = config.theme || detectSystemTheme();
</script>

<div class="chart" class:dark={theme === 'dark'}>
  <!-- Visualization -->
</div>

<style>
  .chart { /* responsive styles */ }
  .chart.dark { /* dark theme */ }
</style>
```

### Utilities (TypeScript)

Utility functions are pure functions with no side effects:

```typescript
export function aggregateSessionsByDay(sessions: SessionData[]): Record<string, SessionData[]> {
  return sessions.reduce((acc, session) => {
    const date = new Date(session.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, SessionData[]>);
}
```

**Guidelines:**
- No side effects
- No external dependencies except types
- Pure input → output mapping
- Type-safe with TypeScript
- Well-documented with JSDoc

## Testing

### Test Structure

Tests use Vitest with describe/it pattern:

```typescript
import { describe, it, expect } from 'vitest';
import { aggregateSessionsByDay } from './aggregation';
import type { SessionData } from '../types';

describe('Aggregation Utilities', () => {
  const mockSessions: SessionData[] = [
    { id: '1', taskId: 'task-1', rating: 4, duration: 30, date: '2024-12-08' },
    // ... more test data
  ];

  describe('aggregateSessionsByDay', () => {
    it('should group sessions by date', () => {
      const result = aggregateSessionsByDay(mockSessions);
      
      expect(result).toHaveProperty('2024-12-08');
      expect(result['2024-12-08']).toHaveLength(1);
    });

    it('should handle empty sessions', () => {
      const result = aggregateSessionsByDay([]);
      expect(result).toEqual({});
    });
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Specific file
npm test aggregation.test.ts

# Watch mode
npm test --watch

# Coverage
npm run test:coverage
```

### Test Coverage Goals

- Utilities: 100% coverage (all functions, branches, edge cases)
- Types: Validation only (interfaces tested via utilities)
- Components: Integration tests via demo app

## Adding a New Component

### 1. Create Component File
```svelte
<!-- src/charts/NewChart.svelte -->
<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  export let data: SessionData[];
  export let config: ChartConfig = {};
</script>

<div class="chart">
  <!-- Your visualization -->
</div>

<style>
  .chart { /* Styles */ }
</style>
```

### 2. Export from index.ts
```typescript
// src/index.ts
export { default as NewChart } from './charts/NewChart.svelte';
```

### 3. Update types.ts if needed
```typescript
export interface NewChartConfig extends ChartConfig {
  customProp?: string;
}
```

### 4. Add to demo app
```svelte
<!-- demo/src/routes/+page.svelte -->
<NewChart data={sessions} config={config} />
```

## Adding a New Utility Function

### 1. Implement in utils/aggregation.ts
```typescript
/**
 * @description Does something useful with sessions
 * @param sessions - Array of sessions
 * @returns Computed result
 * @example
 * const result = newUtility(sessions);
 */
export function newUtility(sessions: SessionData[]): ResultType {
  // Implementation
  return result;
}
```

### 2. Add Types
```typescript
// types.ts
export interface ResultType {
  property: string;
}
```

### 3. Export from utils/index.ts
```typescript
export { newUtility } from './aggregation';
```

### 4. Add Tests
```typescript
// utils/aggregation.test.ts
describe('newUtility', () => {
  it('should compute correctly', () => {
    const result = newUtility(mockSessions);
    expect(result).toBeDefined();
  });

  it('should handle edge cases', () => {
    const result = newUtility([]);
    expect(result).toEqual(expectedEmpty);
  });
});
```

### 5. Update main index.ts
```typescript
export { newUtility } from './utils';
```

## Code Style

### TypeScript
- Strict mode enabled
- Type everything explicitly
- Use interfaces for object types
- Prefer const over let

### Svelte
- Use TypeScript in script tags
- Reactive declarations with $:
- Scoped styles
- Accessible markup (ARIA labels where needed)

### Utilities
- Pure functions only
- Immutable data handling
- Comprehensive JSDoc comments
- Input validation

### Testing
- Describe related tests
- Use meaningful test names
- Test happy path and edge cases
- Mock data should match real shapes

## Performance Considerations

### Large Datasets
```typescript
// ❌ Don't: Recalculate every render
$: result = expensiveOperation(data);

// ✅ Do: Memoize or limit data
$: limited = data.slice(-90); // Last 90 days
$: result = expensiveOperation(limited);
```

### Component Updates
```svelte
<!-- ❌ Don't: Pass entire dataset if only part changes -->
<Component data={allSessions} />

<!-- ✅ Do: Filter and pass relevant data -->
<Component data={recentSessions} />
```

### Utility Functions
```typescript
// ✅ Utilities are already optimized for performance
// They use reduce for single-pass processing
// No caching needed - called only when dependencies change
```

## Responsive Design

### Mobile-First Approach
```svelte
<style>
  /* Default: mobile */
  .container { width: 100%; }
  
  /* Tablet and up */
  @media (min-width: 768px) {
    .container { width: 50%; }
  }
  
  /* Desktop and up */
  @media (min-width: 1024px) {
    .container { width: 33%; }
  }
</style>
```

### Testing Responsiveness
1. Check demo app on mobile/tablet
2. Test with browser dev tools device simulation
3. Verify touch interactions work

## Theme Support

### Light/Dark Theme
```svelte
<script lang="ts">
  function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  $: theme = config.theme || getSystemTheme();
</script>

<div class:dark={theme === 'dark'}>
  <!-- Content -->
</div>

<style>
  :global(:root) {
    --color-bg: white;
    --color-text: black;
  }
  
  :global(:root.dark) {
    --color-bg: #1a1a1a;
    --color-text: white;
  }
  
  div {
    background: var(--color-bg);
    color: var(--color-text);
  }
  
  div.dark {
    background: var(--color-bg);
    color: var(--color-text);
  }
</style>
```

## Building and Publishing

### Local Build
```bash
npm run build
```

Outputs to `dist/` directory ready for publication.

### Publishing to NPM
```bash
npm version patch  # or minor/major
npm publish
```

## Git Workflow

### Branch Naming
```
feature/add-new-chart
fix/date-parsing-issue
docs/update-readme
```

### Commit Messages
```
[FEATURE] Add new chart component
[FIX] Fix date range filtering edge case
[DOCS] Update API reference
[TEST] Add tests for new utility
```

### Pull Request
1. Create branch from main
2. Make changes with tests
3. Ensure all tests pass: `npm test`
4. Update documentation
5. Create PR with description
6. Merge to main

## Documentation

### Component Documentation
```svelte
/**
 * SessionsOverDays - Line chart visualization
 * 
 * Shows session frequency over time with tooltip on hover.
 * 
 * @component
 * @example
 * <SessionsOverDays data={sessions} config={{ title: 'My Sessions' }} />
 * 
 * @param {SessionData[]} data - Array of session records
 * @param {ChartConfig} [config] - Optional configuration
 * @returns {HTMLElement} Rendered chart component
 */
```

### Utility Documentation
```typescript
/**
 * Aggregates sessions into weekly statistics
 * 
 * Groups sessions by ISO week (Monday-Sunday) and computes
 * totals, averages, and task counts for each week.
 * 
 * @param {SessionData[]} sessions - Array of sessions
 * @returns {WeeklyStats[]} Array of weekly aggregations
 * 
 * @example
 * const weeks = aggregateByWeek(sessions);
 * weeks.forEach(w => console.log(`${w.week}: ${w.totalSessions} sessions`));
 * 
 * @performance O(n) where n = number of sessions
 */
```

## Troubleshooting Development

| Issue | Solution |
|-------|----------|
| Tests failing | Run `npm test` and check output, verify mock data format |
| Component not rendering | Check data prop is provided and valid |
| TypeScript errors | Ensure all imports have types, check types.ts |
| Build failing | Run `npm install` to ensure dependencies, check Svelte syntax |
| Date issues | Use ISO format strings (YYYY-MM-DD) for consistency |

## Resources

- [Svelte Docs](https://svelte.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vitest Docs](https://vitest.dev)
- [Chart.js Docs](https://www.chartjs.org) (for visualization inspiration)

## Getting Help

1. Check existing tests for usage examples
2. Review component source code
3. Check demo app for real-world usage
4. Review type definitions in types.ts

---

Happy coding! 🚀
