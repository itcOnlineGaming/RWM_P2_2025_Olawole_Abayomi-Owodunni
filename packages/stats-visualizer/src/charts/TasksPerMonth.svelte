<script lang="ts">
  import type { TaskData, ChartConfig } from '../types';

  export let data: TaskData[] = [];
  export let config: ChartConfig = {
    title: 'Tasks Completed Per Month',
    theme: 'light',
    height: 400,
    responsive: true
  };

  $: completedTasks = data.filter(task => task.completedAt);

  $: monthlyData = (() => {
    const monthMap = new Map<string, number>();

    completedTasks.forEach(task => {
      if (task.completedAt) {
        const date = new Date(task.completedAt * 1000); // Convert from Unix timestamp
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
      }
    });

    // Sort by date and convert to array
    return Array.from(monthMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([month, count]) => {
        // Extract first 3 letters of month name
        const abbrev = month.split(' ')[0].substring(0, 3);
        return { month, abbrev, count };
      });
  })();

  $: maxCount = monthlyData.length > 0 
    ? Math.max(...monthlyData.map(m => m.count), 5)
    : 5;

  $: totalCompleted = completedTasks.length;
  $: averagePerMonth = monthlyData.length > 0
    ? (totalCompleted / monthlyData.length).toFixed(1)
    : '0.0';

  const chartPadding = { top: 40, right: 20, bottom: 60, left: 50 };
  const innerHeight = config.height - chartPadding.top - chartPadding.bottom;
  const chartWidth = 800;
  $: barWidth = monthlyData.length > 0 
    ? (chartWidth / monthlyData.length) * 0.6 
    : 0;
  $: barGap = monthlyData.length > 0 
    ? ((chartWidth / monthlyData.length) - barWidth) / 2 
    : 0;

  function getBarHeight(count: number): number {
    return (count / maxCount) * innerHeight;
  }

  function getBarColor(count: number): string {
    if (config.theme === 'dark') {
      if (count >= maxCount * 0.75) return '#4ade80';
      if (count >= maxCount * 0.5) return '#60a5fa';
      if (count >= maxCount * 0.25) return '#facc15';
      return '#fb923c';
    } else {
      if (count >= maxCount * 0.75) return '#16a34a';
      if (count >= maxCount * 0.5) return '#2563eb';
      if (count >= maxCount * 0.25) return '#d97706';
      return '#ea580c';
    }
  }
</script>

<div class="chart-container" style="--theme: {config.theme}">
  <div class="chart-header">
    <h2>{config.title}</h2>
  </div>

  {#if monthlyData.length === 0}
    <div class="empty-state">
      <p>No completed tasks yet</p>
    </div>
  {:else}
    <div class="chart-wrapper">
      <svg
        width="100%"
        height={config.height}
        viewBox="0 0 {chartWidth + chartPadding.left + chartPadding.right} {config.height}"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Grid lines -->
        {#each Array.from({ length: 6 }) as _, i}
          {@const gridValue = Math.round((i / 5) * maxCount)}
          {@const y = chartPadding.top + innerHeight - (gridValue / maxCount) * innerHeight}
          <line
            x1={chartPadding.left}
            y1={y}
            x2={chartWidth + chartPadding.left}
            y2={y}
            class="grid-line"
          />
          <text
            x={chartPadding.left - 10}
            y={y + 5}
            class="axis-label"
            text-anchor="end"
          >
            {gridValue}
          </text>
        {/each}

        <!-- Bars -->
        {#each monthlyData as item, index}
          {@const barHeight = getBarHeight(item.count)}
          {@const x = chartPadding.left + index * (barWidth + barGap * 2) + barGap}
          {@const y = chartPadding.top + innerHeight - barHeight}
          <g class="bar-group">
            <rect
              {x}
              {y}
              width={barWidth}
              height={barHeight}
              fill={getBarColor(item.count)}
              class="bar"
            />
            <!-- Count label on top of bar -->
            <text
              x={x + barWidth / 2}
              y={y - 8}
              class="bar-label"
              text-anchor="middle"
            >
              {item.count}
            </text>
          </g>
        {/each}

        <!-- X-axis labels -->
        {#each monthlyData as item, index}
          {@const x = chartPadding.left + index * (barWidth + barGap * 2) + barGap + barWidth / 2}
          {@const y = chartPadding.top + innerHeight + 35}
          <g>
            <title>{item.month}</title>
            <text
              {x}
              {y}
              class="axis-label x-label"
              text-anchor="middle"
            >
              {item.abbrev}
            </text>
          </g>
        {/each}

        <!-- Y-axis label -->
        <text
          x={-config.height / 2}
          y={15}
          class="axis-title"
          text-anchor="middle"
          transform="rotate(-90 15 {config.height / 2})"
        >
          Tasks Completed
        </text>

        <!-- X-axis line -->
        <line
          x1={chartPadding.left}
          y1={chartPadding.top + innerHeight}
          x2={chartWidth + chartPadding.left}
          y2={chartPadding.top + innerHeight}
          class="axis-line"
        />

        <!-- Y-axis line -->
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={chartPadding.top + innerHeight}
          class="axis-line"
        />
      </svg>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="label">Total Completed</span>
        <span class="value">{totalCompleted}</span>
      </div>
      <div class="stat">
        <span class="label">Months Tracked</span>
        <span class="value">{monthlyData.length}</span>
      </div>
      <div class="stat">
        <span class="label">Average Per Month</span>
        <span class="value">{averagePerMonth}</span>
      </div>
      <div class="stat">
        <span class="label">Peak Month</span>
        <span class="value">{Math.max(...monthlyData.map(m => m.count))}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  :global([style*="--theme: dark"]) {
    --bg-primary: #1f2937;
    --text-primary: #f3f4f6;
    --axis-color: #d1d5db;
    --grid-color: rgba(209, 213, 219, 0.1);
  }

  :global([style*="--theme: light"]) {
    --bg-primary: #ffffff;
    --text-primary: #1f2937;
    --axis-color: #374151;
    --grid-color: rgba(0, 0, 0, 0.05);
  }

  .chart-header {
    margin-bottom: 1.5rem;
  }

  .chart-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: var(--text-primary);
    opacity: 0.6;
  }

  .chart-wrapper {
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  :global(.grid-line) {
    stroke: var(--grid-color);
    stroke-width: 1;
  }

  :global(.axis-line) {
    stroke: var(--axis-color);
    stroke-width: 2;
  }

  :global(.axis-label) {
    font-size: 12px;
    fill: var(--text-primary);
    opacity: 0.7;
  }

  :global(.x-label) {
    font-size: 12px;
  }

  :global(.axis-title) {
    font-size: 13px;
    font-weight: 600;
    fill: var(--text-primary);
  }

  :global(.bar) {
    transition: opacity 0.3s ease;
    cursor: pointer;
  }

  :global(.bar:hover) {
    opacity: 0.8;
  }

  :global(.bar-label) {
    font-size: 13px;
    font-weight: 600;
    fill: var(--text-primary);
  }

  :global(.bar-group:hover .bar) {
    opacity: 0.8;
    filter: brightness(1.1);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--axis-color);
    opacity: 0.8;
  }

  .label {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  @media (max-width: 768px) {
    .chart-container {
      padding: 1rem;
    }

    .chart-header h2 {
      font-size: 1.2rem;
    }

    .stats {
      grid-template-columns: 1fr;
    }

    .stat {
      padding: 0.75rem;
    }

    .label {
      font-size: 0.75rem;
    }

    .value {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .chart-container {
      padding: 0.75rem;
    }

    .chart-header h2 {
      font-size: 1rem;
    }

    .stats {
      gap: 0.5rem;
    }

    .stat {
      padding: 0.5rem;
      border-radius: 0.375rem;
    }

    .label {
      font-size: 0.65rem;
    }

    .value {
      font-size: 1rem;
    }
  }
</style>
