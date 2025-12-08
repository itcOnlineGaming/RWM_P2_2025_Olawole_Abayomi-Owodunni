<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  import { getAverageRatingPerTask } from '../utils/aggregation';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ taskSelected: string }>();

  export let data: SessionData[] = [];
  export let config: ChartConfig = {
    title: 'Average Rating Per Task',
    theme: 'light',
    height: 400,
    responsive: true
  };

  $: taskRatings = getAverageRatingPerTask(data);
  $: tasks = Object.entries(taskRatings).map(([taskId, rating]) => ({
    taskId,
    rating,
    percentage: (rating / 5) * 100
  }));
  $: maxRating = Math.max(5, ...tasks.map(t => t.rating), 5);
  $: avgOverall = tasks.length > 0 
    ? (tasks.reduce((sum, t) => sum + t.rating, 0) / tasks.length).toFixed(1)
    : '0.0';

  const chartPadding = { top: 40, right: 20, bottom: 60, left: 50 };
  const innerHeight = config.height - chartPadding.top - chartPadding.bottom;
  const chartWidth = 800;
  $: barWidth = chartWidth / Math.max(tasks.length, 1) * 0.6;
  $: barGap = (chartWidth / Math.max(tasks.length, 1) - barWidth) / 2;

  function getBarHeight(rating: number): number {
    return (rating / maxRating) * innerHeight;
  }

  function getBarColor(rating: number): string {
    if (config.theme === 'dark') {
      if (rating >= 4.5) return '#4ade80';
      if (rating >= 4) return '#60a5fa';
      if (rating >= 3.5) return '#facc15';
      return '#f87171';
    } else {
      if (rating >= 4.5) return '#16a34a';
      if (rating >= 4) return '#2563eb';
      if (rating >= 3.5) return '#d97706';
      return '#dc2626';
    }
  }

  function handleBarClick(taskId: string): void {
    dispatch('taskSelected', taskId);
  }

  function handleBarKeydown(e: KeyboardEvent, taskId: string): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dispatch('taskSelected', taskId);
    }
  }
</script>

<div class="chart-container" style="--theme: {config.theme}">
  <div class="chart-header">
    <h2>{config.title}</h2>
  </div>

  {#if tasks.length === 0}
    <div class="empty-state">
      <p>No data available</p>
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
          {@const gridValue = (i / 5) * maxRating}
          {@const y = chartPadding.top + innerHeight - (gridValue / maxRating) * innerHeight}
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
            {gridValue.toFixed(1)}
          </text>
        {/each}

        <!-- Bars -->
        {#each tasks as task, index}
          {@const barHeight = getBarHeight(task.rating)}
          {@const x = chartPadding.left + index * (barWidth + barGap * 2) + barGap}
          {@const y = chartPadding.top + innerHeight - barHeight}
          <g 
            class="bar-group" 
            on:click={() => handleBarClick(task.taskId)} 
            on:keydown={(e) => handleBarKeydown(e, task.taskId)}
            role="button" 
            tabindex="0"
          >
            <rect
              {x}
              {y}
              width={barWidth}
              height={barHeight}
              fill={getBarColor(task.rating)}
              class="bar clickable"
            />
            <!-- Rating label on top of bar -->
            <text
              x={x + barWidth / 2}
              y={y - 8}
              class="bar-label"
              text-anchor="middle"
            >
              {task.rating.toFixed(1)}
            </text>
          </g>
        {/each}

        <!-- X-axis labels -->
        {#each tasks as task, index}
          {@const x = chartPadding.left + index * (barWidth + barGap * 2) + barGap + barWidth / 2}
          {@const y = chartPadding.top + innerHeight + 35}
          <text
            {x}
            {y}
            class="axis-label x-label"
            text-anchor="middle"
          >
            {task.taskId}
          </text>
        {/each}

        <!-- Y-axis label -->
        <text
          x={-config.height / 2}
          y={15}
          class="axis-title"
          text-anchor="middle"
          transform="rotate(-90 15 {config.height / 2})"
        >
          Rating (0-5)
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
        <span class="label">Average Rating</span>
        <span class="value">{avgOverall}/5</span>
      </div>
      <div class="stat">
        <span class="label">Tasks Tracked</span>
        <span class="value">{tasks.length}</span>
      </div>
      <div class="stat">
        <span class="label">Highest Rating</span>
        <span class="value">{Math.max(...tasks.map(t => t.rating)).toFixed(1)}</span>
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
    font-weight: 500;
    fill: var(--text-primary);
  }

  :global(.clickable) {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  :global(.clickable:hover) {
    opacity: 0.8;
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
