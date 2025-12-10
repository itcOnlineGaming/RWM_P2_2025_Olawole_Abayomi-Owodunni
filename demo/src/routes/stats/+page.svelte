<script lang="ts">
  import { SessionsOverDays, AvgRatingPerTask, SessionRatingsPerTask, TasksPerMonth } from '@ayola/stats-visualizer';
  import type { SessionData, TaskData, ChartConfig } from '@ayola/stats-visualizer';
  import { getSessions, getTasks, saveSessions, saveTasks, clearStoredData, hasStoredData } from '$lib/utils/storage';
  import { onMount } from 'svelte';

  let sessions: SessionData[] = [];
  let tasks: TaskData[] = [];
  let dataLoaded = false;
  let selectedTaskId: string | null = null;
  let showModal: boolean = false;
  let showFiltersModal: boolean = false;

  // Filter and toggle state
  let dateRange: 'all' | '7' | '14' | '30' = '30';
  let selectedTasks: Set<string> = new Set(['task-1', 'task-2', 'task-3']);
  let minRating: number = 1;
  let allAvailableTasks: Set<string> = new Set();

  // Filtered sessions based on current filters
  $: filteredSessions = sessions.filter(session => {
    // Date range filter
    const sessionDate = new Date(session.date);
    const now = new Date();
    const daysAgo = parseInt(dateRange);

    if (daysAgo !== parseInt('all') && !isNaN(daysAgo)) {
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      if (sessionDate < cutoffDate) return false;
    }

    // Task filter
    if (!selectedTasks.has(session.taskId)) return false;

    // Rating filter
    if (session.rating < minRating) return false;

    return true;
  });

  // Extract all unique tasks for filter UI
  $: {
    const taskIds = new Set<string>();
    sessions.forEach(s => taskIds.add(s.taskId));
    allAvailableTasks = taskIds;

    // Initialize filter if empty
    if (allAvailableTasks.size > 0 && selectedTasks.size === 0) {
      selectedTasks = new Set(allAvailableTasks);
    }
  }

  function generateSampleData() {
    sessions = [];
    tasks = [];

    // Generate tasks with completion dates spread across months
    for (let i = 0; i < 12; i++) {
      const completedDate = new Date();
      completedDate.setMonth(completedDate.getMonth() - i);
      completedDate.setDate(1 + Math.floor(Math.random() * 28));

      const tasksInMonth = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < tasksInMonth; j++) {
        tasks.push({
          id: `task-${i}-${j}`,
          title: `Task ${i * 5 + j + 1}`,
          description: `Sample task completed in month ${i}`,
          completedAt: Math.floor(completedDate.getTime() / 1000),
          totalSessions: Math.floor(Math.random() * 10) + 1,
          averageRating: Math.floor(Math.random() * 3) + 3
        });
      }
    }

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const sessionsPerDay = Math.floor(Math.random() * 9);
      for (let j = 0; j < sessionsPerDay; j++) {
        sessions.push({
          id: `session-${i}-${j}`,
          taskId: `task-${Math.floor(Math.random() * 3) + 1}`,
          rating: Math.floor(Math.random() * 3) + 3,
          duration: Math.floor(Math.random() * 90) + 30,
          date: dateStr,
          notes: `Sample session`
        });
      }
    }

    // Save to localStorage
    saveSessions(sessions);
    saveTasks(tasks);
  }

  function clearData() {
    sessions = [];
    tasks = [];
    clearStoredData();
  }

  // Load data on component mount
  onMount(() => {
    if (hasStoredData()) {
      sessions = getSessions();
      tasks = getTasks();
    } else {
      // Generate initial data if none exists
      generateSampleData();
    }
    dataLoaded = true;
  });

  function toggleTask(taskId: string): void {
    if (selectedTasks.has(taskId)) {
      selectedTasks.delete(taskId);
    } else {
      selectedTasks.add(taskId);
    }
    selectedTasks = selectedTasks;
  }

  function toggleAllTasks(): void {
    if (selectedTasks.size === allAvailableTasks.size) {
      selectedTasks.clear();
    } else {
      selectedTasks = new Set(allAvailableTasks);
    }
  }

  // Generate initial data
  generateSampleData();

  // Detect system theme preference
  const prefersDark = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;

  let sessionsOverDaysConfig: ChartConfig = {
    title: 'Sessions Over Time',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };

  let avgRatingConfig: ChartConfig = {
    title: 'Average Rating Per Task',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };

  let sessionRatingsConfig: ChartConfig = {
    title: 'Session Ratings Over Time',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };

  let tasksPerMonthConfig: ChartConfig = {
    title: 'Tasks Completed Per Month',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };
</script>

<div class="container">
  <header>
    <h1>Analytics Dashboard</h1>
    <p>Deep dive into your performance data</p>
  </header>

  <div class="controls-bar">
    <div class="controls-group">
      <button on:click={generateSampleData} class="primary">
        Generate New Data
      </button>
      <button on:click={clearData} class="secondary">
        Clear Data
      </button>
    </div>
    <button on:click={() => (showFiltersModal = true)} class="filter-toggle">
      <span>⚙️</span>
    </button>
    <a href="/streak" class="nav-link">Motivation</a>
  </div>

  <main>
    <section>
      <SessionsOverDays data={filteredSessions} config={sessionsOverDaysConfig} />
    </section>

    <section>
      <AvgRatingPerTask
        data={filteredSessions}
        config={avgRatingConfig}
        on:taskSelected={(e) => {
          selectedTaskId = e.detail;
          showModal = true;
        }}
      />
    </section>

    <section>
      <TasksPerMonth data={tasks} config={tasksPerMonthConfig} />
    </section>

    <section class="info">
      <h2>Analytics Components</h2>

      <div class="chart-info">
        <h3>📊 Sessions Over Time</h3>
        <p>Visualizes session counts over consecutive days with trend analysis.</p>
        <ul>
          <li>Line chart with area fill gradient</li>
          <li>Dynamic y-axis scaling</li>
          <li>Displays: Total Sessions, Days Tracked, Peak Sessions</li>
          <li>Fully responsive for all screen sizes</li>
        </ul>
      </div>

      <div class="chart-info">
        <h3>⭐ Average Rating Per Task</h3>
        <p>Bar chart showing the average star rating (1-5) for each task.</p>
        <ul>
          <li>Color-coded bars (green/blue/yellow/red)</li>
          <li>Calculated from all sessions per task</li>
          <li>Displays: Average Rating, Tasks Tracked, Highest Rating</li>
          <li>Mobile-optimized stat layout</li>
          <li>Click a task to see detailed session ratings</li>
        </ul>
      </div>

      <div class="chart-info">
        <h3>✅ Tasks Completed Per Month</h3>
        <p>Bar chart showing how many tasks you completed each month.</p>
        <ul>
          <li>Reads completedAt timestamps from your Activity Tracker</li>
          <li>Color intensity indicates completion rate</li>
          <li>Displays: Total Completed, Months Tracked, Average/Peak Month</li>
          <li>Chronologically sorted months</li>
        </ul>
      </div>

      <div class="chart-info">
        <h3>🎛️ Filters</h3>
        <p>Customize your analytics view with flexible filtering options.</p>
        <ul>
          <li><strong>Date Range:</strong> Last 7, 14, 30 days or All Time</li>
          <li><strong>Minimum Rating:</strong> Show only sessions rated above threshold</li>
          <li><strong>Task Selection:</strong> Focus on specific tasks or all at once</li>
        </ul>
      </div>
    </section>
  </main>
</div>

<!-- Filters Modal -->
{#if showFiltersModal}
  <div
    class="filters-modal-overlay"
    on:click={() => (showFiltersModal = false)}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Escape' && (showFiltersModal = false)}
  >
    <div class="filters-modal-content" on:click={(e) => e.stopPropagation()}>
      <div class="filters-modal-header">
        <h2>Filters</h2>
        <button class="close-btn" on:click={() => (showFiltersModal = false)}>×</button>
      </div>

      <div class="filters-modal-body">
        <!-- Date Range Filter -->
        <div class="filter-section">
          <label>Date Range:</label>
          <div class="filter-button-group">
            <button
              class={dateRange === '7' ? 'active' : ''}
              on:click={() => (dateRange = '7')}
            >
              Last 7 Days
            </button>
            <button
              class={dateRange === '14' ? 'active' : ''}
              on:click={() => (dateRange = '14')}
            >
              Last 14 Days
            </button>
            <button
              class={dateRange === '30' ? 'active' : ''}
              on:click={() => (dateRange = '30')}
            >
              Last 30 Days
            </button>
            <button
              class={dateRange === 'all' ? 'active' : ''}
              on:click={() => (dateRange = 'all')}
            >
              All Time
            </button>
          </div>
        </div>

        <!-- Rating Threshold Filter -->
        <div class="filter-section">
          <label>Min Rating: <strong>{minRating} ⭐</strong></label>
          <input
            type="range"
            min="1"
            max="5"
            bind:value={minRating}
            class="slider"
          />
        </div>

        <!-- Task Filter -->
        <div class="filter-section">
          <label>Tasks:</label>
          <div class="task-filter">
            <button
              class={selectedTasks.size === allAvailableTasks.size && allAvailableTasks.size > 0 ? 'active' : ''}
              on:click={toggleAllTasks}
              class:filter-button={true}
            >
              {selectedTasks.size === allAvailableTasks.size && allAvailableTasks.size > 0
                ? '✓ All'
                : 'Select All'}
            </button>
            {#each Array.from(allAvailableTasks).sort() as taskId (taskId)}
              <button
                class={selectedTasks.has(taskId) ? 'active' : ''}
                on:click={() => toggleTask(taskId)}
                class:filter-button={true}
              >
                {selectedTasks.has(taskId) ? '✓' : ''} {taskId}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Session Details Modal -->
{#if showModal && selectedTaskId}
  <div
    class="modal-overlay"
    on:click={() => (showModal = false)}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Escape' && (showModal = false)}
  >
    <div class="modal-content" on:click={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2>Session Details: {selectedTaskId}</h2>
        <button class="close-btn" on:click={() => (showModal = false)}>×</button>
      </div>
      <div class="modal-body">
        <SessionRatingsPerTask
          data={filteredSessions}
          {selectedTaskId}
          config={{...sessionRatingsConfig, title: `${selectedTaskId} - Session Ratings`}}
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
  }

  header h1 {
    font-size: 2.5rem;
    margin: 0;
    font-weight: 700;
  }

  header p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0.5rem 0 0 0;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    gap: 2rem;
  }

  section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .controls-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    position: relative;
  }

  .controls-group {
    display: flex;
    gap: 1rem;
  }

  button,
  .nav-link {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    background: white;
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-decoration: none;
    display: inline-block;
  }

  button:hover,
  .nav-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  button.secondary {
    background: #e0e0e0;
    color: #333;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  button.secondary:hover {
    background: #d0d0d0;
  }

  .filter-toggle {
    position: fixed;
    top: 1.5rem;
    right: 1.5rem;
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    font-size: 1.5rem;
  }

  .info {
    background: #f8f9ff;
  }

  .info h2 {
    color: #667eea;
    margin-top: 0;
  }

  .chart-info {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0ff;
  }

  .chart-info:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .chart-info h3 {
    color: #667eea;
    font-size: 1.2rem;
    margin: 0 0 0.75rem 0;
  }

  .chart-info p {
    color: #666;
    line-height: 1.6;
    margin: 0 0 0.75rem 0;
  }

  .chart-info ul {
    color: #666;
    line-height: 1.8;
    margin: 0;
    padding-left: 1.5rem;
  }

  .chart-info li {
    margin-bottom: 0.5rem;
  }

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-section label {
    color: #333;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .filter-button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-button-group button {
    width: 100%;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .task-filter {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  button.filter-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    background: white;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  button.filter-button.active {
    background: #60a5fa;
    color: white;
  }

  .slider {
    width: 150px;
    height: 6px;
    cursor: pointer;
  }

  .filters-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.3s ease;
  }

  .filters-modal-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 350px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideInRight 0.3s ease;
    margin-top: 5rem;
    margin-right: 1rem;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .filters-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .filters-modal-header h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
  }

  .filters-modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #e0e0e0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
  }

  .close-btn:hover {
    opacity: 0.8;
  }

  .modal-body {
    padding: 2rem;
  }

  :global(.modal-content > div[style*='--theme']) {
    border-radius: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    header h1 {
      font-size: 1.8rem;
    }

    section {
      padding: 1.5rem;
    }

    main {
      gap: 1.5rem;
    }

    .controls-bar {
      flex-direction: column;
      gap: 0.75rem;
    }

    button,
    .nav-link {
      width: 100%;
    }

    .controls-group {
      width: 100%;
      flex-direction: column;
    }

    button,
    .nav-link {
      padding: 0.75rem 1rem;
    }

    .filter-toggle {
      position: fixed;
      top: 1rem;
      right: auto;
      left: 1rem;
      width: 45px;
      height: 45px;
    }

    .filters-modal-content {
      max-width: 100%;
      margin-top: 4rem;
      margin-right: 0;
      margin-left: 0;
    }

    .filters-modal-overlay {
      align-items: flex-start;
      justify-content: center;
    }

    .filter-button-group {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .filter-button-group button {
      width: auto;
      flex: 1;
      min-width: 80px;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0.75rem;
    }

    header h1 {
      font-size: 1.5rem;
    }

    header p {
      font-size: 0.95rem;
    }

    section {
      padding: 1rem;
      border-radius: 0.75rem;
    }

    main {
      gap: 1rem;
    }

    button,
    .nav-link {
      padding: 0.65rem 0.75rem;
      font-size: 0.9rem;
    }

    .info {
      font-size: 0.9rem;
    }

    .info h2 {
      font-size: 1.2rem;
    }

    .chart-info p {
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .chart-info ul {
      padding-left: 1.5rem;
    }

    .chart-info li {
      margin-bottom: 0.35rem;
      font-size: 0.85rem;
    }
  }
</style>
