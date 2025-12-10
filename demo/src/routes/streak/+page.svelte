<script lang="ts">
  import { DailyStreakTracker, FlameTracker, TrophyTracker } from '@ayola/stats-visualizer';
  import type { SessionData, TaskData, ChartConfig } from '@ayola/stats-visualizer';
  import { getSessions, getTasks, saveSessions, saveTasks, clearStoredData, hasStoredData } from '$lib/utils/storage';
  import { onMount } from 'svelte';

  let sessions: SessionData[] = [];
  let tasks: TaskData[] = [];
  let dataLoaded = false;

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

  // Detect system theme preference
  const prefersDark = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;

  let flameConfig: ChartConfig = {
    title: 'Flame Tracker - Motivation Level',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };

  let trophyConfig: ChartConfig = {
    title: 'Trophy Tracker - Monthly Achievement',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };

  let streakConfig: ChartConfig = {
    title: 'Daily Streak Tracker',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };
</script>

<div class="container">
  <header>
    <h1>Motivation Hub</h1>
    <p>Track your motivation and progress</p>
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
    <a href="/stats" class="nav-link">Analytics</a>
  </div>

  <main>
    <section>
      <FlameTracker data={sessions} config={flameConfig} />
    </section>

    <section>
      <TrophyTracker data={tasks} config={trophyConfig} />
    </section>

    <section>
      <DailyStreakTracker data={sessions} config={streakConfig} />
    </section>

    <section class="info">
      <h2>Your Motivation Trackers</h2>

      <div class="tracker-info">
        <h3>🔥 Flame Tracker</h3>
        <p>Your session motivation meter. The flame grows with every session and gradually fades on rest days (never fully extinguishing).</p>
        <ul>
          <li><strong>Grows:</strong> 3% per session</li>
          <li><strong>Decays:</strong> 15% per missed day</li>
          <li><strong>Never resets:</strong> Minimum 10% smolder state keeps you motivated</li>
          <li><strong>Levels:</strong> Smolder → Low → Medium → High intensity</li>
        </ul>
      </div>

      <div class="tracker-info">
        <h3>🏆 Trophy Tracker</h3>
        <p>Your monthly achievement progress. Fills up with each completed task and resets fresh on the 1st of each month.</p>
        <ul>
          <li><strong>Grows:</strong> 8% per task completed</li>
          <li><strong>Resets:</strong> Automatically on the 1st of each month</li>
          <li><strong>Milestones:</strong> Shimmer animation every 5 tasks</li>
          <li><strong>Fresh starts:</strong> New motivation cycle each month</li>
        </ul>
      </div>

      <div class="tracker-info">
        <h3>🔥 Daily Streak</h3>
        <p>365-day heatmap showing your activity pattern. Track your consecutive days and find your longest streak.</p>
        <ul>
          <li><strong>Visual:</strong> GitHub-style intensity gradient</li>
          <li><strong>Tracks:</strong> Current and longest streaks</li>
          <li><strong>Range:</strong> Full year of activity history</li>
          <li><strong>Interactive:</strong> Hover for exact session counts</li>
        </ul>
      </div>
    </section>
  </main>
</div>

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

  .info {
    background: #f8f9ff;
  }

  .info h2 {
    color: #667eea;
    margin-top: 0;
  }

  .tracker-info {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e0e0ff;
  }

  .tracker-info:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .tracker-info h3 {
    color: #667eea;
    font-size: 1.2rem;
    margin: 0 0 0.75rem 0;
  }

  .tracker-info p {
    color: #666;
    line-height: 1.6;
    margin: 0 0 0.75rem 0;
  }

  .tracker-info ul {
    color: #666;
    line-height: 1.8;
    margin: 0;
    padding-left: 1.5rem;
  }

  .tracker-info li {
    margin-bottom: 0.5rem;
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

    .tracker-info p {
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    .tracker-info ul {
      padding-left: 1.5rem;
    }

    .tracker-info li {
      margin-bottom: 0.35rem;
      font-size: 0.85rem;
    }
  }
</style>
