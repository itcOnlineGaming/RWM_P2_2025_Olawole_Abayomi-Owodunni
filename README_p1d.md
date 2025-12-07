# ACTIVITY TRACKER - COMPREHENSIVE PROJECT DOCUMENTATION

**Version:** 1.0.0  
**Project Name:** Team 1 2025 (Activity Tracker)  
**Framework:** SvelteKit + Vite  
**Last Updated:** December 7, 2025

---

## TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Core Data Models & Interfaces](#core-data-models--interfaces)
5. [State Management (Svelte Stores)](#state-management-svelte-stores)
6. [Components Documentation](#components-documentation)
7. [Routing & Pages](#routing--pages)
8. [API Endpoints](#api-endpoints)
9. [Styling & Theme](#styling--theme)
10. [Data Persistence](#data-persistence)
11. [User Workflows](#user-workflows)
12. [Testing & Quality Assurance](#testing--quality-assurance)
13. [Configuration Files](#configuration-files)
14. [Development Setup](#development-setup)

---

## PROJECT OVERVIEW

### Purpose & Goals

**Activity Tracker** is an academic research project designed to help users monitor work sessions, track productivity patterns, and reflect on their performance through structured evaluation questionnaires. The application combines task management, session timing, and comprehensive analytics to provide insights into work habits and distractions.

### Primary Objectives

1. **Session Management**: Enable users to create and track work sessions tied to specific tasks
2. **Evaluation Framework**: Capture detailed feedback about sessions through customizable questionnaires
3. **Analytics & Insights**: Provide visual analytics showing productivity trends and patterns
4. **Reward System**: Gamify progress by allowing users to earn and redeem stars based on session ratings
5. **Research Data**: Collect structured data for academic analysis while maintaining user privacy
6. **Offline-First**: Store all data locally in the browser without server uploads

### Key Features

- ✅ **Task Creation & Management**: Create, organize, and complete tasks with goals
- ✅ **Session Timing**: Track work time with automatic countdown timers
- ✅ **Customizable Templates**: Create and reuse evaluation question templates
- ✅ **Dynamic Questionnaires**: Support for multiple question types (text, select, rating, etc.)
- ✅ **Session Analytics**: Visual charts and statistics on productivity and ratings
- ✅ **Reward System**: Earn stars from evaluations and purchase custom rewards
- ✅ **Mobile Responsive**: Fully responsive design for desktop and mobile devices
- ✅ **Tutorial System**: Guided onboarding for new users
- ✅ **Data Privacy**: 100% local storage—no server communication for user data

---

## ARCHITECTURE & TECHNOLOGY STACK

### Frontend Framework
- **SvelteKit 2.43.2**: Full-stack JavaScript framework with file-based routing
- **Svelte 5.39.5**: Component framework with reactive state management
- **Vite 7.1.7**: Modern bundler and development server

### Styling & UI
- **Tailwind CSS 4.1.13**: Utility-first CSS framework
- **TailwindCSS Forms 0.5.10**: Pre-styled form components
- **TailwindCSS Typography 0.5.18**: Typography plugin for rich text
- **Custom CSS Variables**: Purple-themed color scheme for branding

### State Management
- **Svelte Stores**: Built-in reactive store management (writable, derived)
- **LocalStorage API**: Client-side persistence for all user data
- **Browser-based**: No backend storage or server communication

### Testing & QA
- **Playwright 1.55.1**: End-to-end testing framework
- **Vitest 3.2.4**: Unit testing framework with browser support
- **Vitest Browser Svelte 1.1.0**: Svelte-specific test utilities

### Development Tools
- **TypeScript 5.9.2**: Static type checking and enhanced IDE support
- **Prettier 3.6.2**: Code formatting
- **Storybook 9.1.13**: Component documentation and development
- **SVG Icons**: Custom SVG-based icon system

### Build & Deployment
- **SvelteKit Adapter Static 3.0.10**: Static site generation for hosting
- **Vite Build**: Optimized production bundle generation

---

## PROJECT STRUCTURE

```
frontend/
├── src/
│   ├── app.css                      # Global styles with CSS variables
│   ├── app.d.ts                     # Global TypeScript declarations
│   ├── app.html                     # Root HTML template
│   ├── lib/
│   │   ├── components/              # 19 Svelte UI components
│   │   │   ├── AddRewardButton.svelte
│   │   │   ├── AddRewardModal.svelte
│   │   │   ├── CreateTemplate.svelte
│   │   │   ├── EvaluationQuestionnaire.svelte
│   │   │   ├── MobileBottomNav.svelte
│   │   │   ├── Popup.svelte
│   │   │   ├── RewardCard.svelte
│   │   │   ├── RewardGrid.svelte
│   │   │   ├── SessionDetail.svelte
│   │   │   ├── SessionGraphs.svelte
│   │   │   ├── SessionManager.svelte
│   │   │   ├── SessionTimer.svelte
│   │   │   ├── StarBalance.svelte
│   │   │   ├── TaskCard.svelte
│   │   │   ├── Tasks.svelte
│   │   │   ├── TemplateSelector.svelte
│   │   │   ├── TemplateSelectorModal.svelte
│   │   │   ├── TutorialManager.svelte
│   │   │   └── TutorialTooltip.svelte
│   │   ├── stores/                  # 6 Svelte Store modules
│   │   │   ├── rewards.ts           # Reward system management
│   │   │   ├── sessionStore.ts      # Session data management
│   │   │   ├── storeStore.ts        # Purchase tracking
│   │   │   ├── taskStore.ts         # Task management
│   │   │   ├── templateStore.ts     # Template selection
│   │   │   └── tutorialStore.ts     # Tutorial state
│   │   ├── types/
│   │   │   └── rewards.ts           # Reward interfaces and types
│   │   ├── data/
│   │   │   ├── evaluationTemplates.ts  # Template definitions
│   │   │   └── templates.json       # Default templates
│   │   ├── utils/
│   │   │   └── localStorage.ts      # LocalStorage utilities
│   │   └── assets/                  # Static assets
│   ├── routes/                      # SvelteKit file-based routes
│   │   ├── +layout.js               # Global layout config
│   │   ├── +layout.server.ts        # Server-side layout logic
│   │   ├── +layout.svelte           # Global app wrapper
│   │   ├── +page.svelte             # Home/Dashboard page
│   │   ├── evaluation/
│   │   │   └── +page.svelte         # Evaluation questionnaire page
│   │   ├── info/
│   │   │   └── +page.svelte         # Info/Settings page
│   │   ├── results/
│   │   │   └── +page.svelte         # Results/Analytics page
│   │   ├── store/
│   │   │   └── +page.svelte         # Reward store page
│   │   ├── tasks/
│   │   │   ├── +page.svelte         # Tasks list page
│   │   │   └── [id]/
│   │   │       └── +page.svelte     # Task detail page
│   │   ├── templates/
│   │   │   ├── create/
│   │   │   │   └── +page.svelte     # Create template page
│   │   │   ├── edit/
│   │   │   │   └── [id]/
│   │   │   │       └── +page.svelte # Edit template page
│   │   │   └── view/
│   │   │       └── +page.svelte     # View templates page
│   │   └── api/
│   │       └── templates/
│   │           ├── +server.ts       # GET/POST templates endpoint
│   │           └── [id]/
│   │               └── +server.ts   # GET/PUT/DELETE template endpoint
│   ├── stories/                     # Storybook component stories
│   │   ├── Button.stories.svelte
│   │   ├── Header.stories.svelte
│   │   ├── Page.stories.svelte
│   │   └── assets/
│   └── app.spec.ts                  # Global app test spec
├── tests/
│   └── e2e/                         # End-to-end Playwright tests
│       ├── 404.spec.ts
│       ├── evaluation.spec.ts
│       ├── full-runthrough.spec.ts
│       ├── home.spec.ts
│       ├── info.spec.ts
│       ├── results.spec.ts
│       ├── store.spec.ts
│       ├── tasks.spec.ts
│       ├── templates-edit.spec.ts
│       └── templates.spec.ts
├── playwright.config.ts             # Playwright test configuration
├── vite.config.ts                   # Vite and Vitest configuration
├── tsconfig.json                    # TypeScript configuration
├── svelte.config.js                 # SvelteKit configuration
├── package.json                     # Dependencies and scripts
├── README.md                         # Project overview
└── build/                           # Production build output
```

---

## CORE DATA MODELS & INTERFACES

### 1. Task Interface

```typescript
interface Task {
  id: string;                          // Unique identifier (auto-generated)
  name: string;                        // Task name (e.g., "Study for Biology")
  goal?: string;                       // Optional goal description
  createdAt: number;                   // Unix timestamp
  completedAt?: number;                // Optional completion timestamp
  result?: Record<string, any>;        // Optional completion feedback/result
}
```

**Purpose**: Represents a user's learning or work task that can have multiple sessions.

---

### 2. Session & ActiveSession Interfaces

```typescript
interface SessionResponse {
  question?: string;                   // Question text
  answer?: string;                     // Text answer
  rating?: number;                     // Numeric rating (1-5)
}

interface Session {
  id: string;                          // Unique identifier
  templateId: string;                  // Reference to template used
  templateName: string;                // Name of template (cached)
  startTime: number;                   // Unix timestamp of session start
  endTime?: number;                    // Unix timestamp of session end
  duration: number;                    // Duration in seconds
  responses: Record<string, SessionResponse>;  // Question responses
  overallRating?: number;              // First question's star rating
  group?: string;                      // Optional group/category
  notes?: string;                      // Optional user notes
  taskId?: string;                     // Reference to parent task
  taskName?: string;                   // Task name (cached)
}

interface ActiveSession {
  id: string;                          // Unique identifier
  templateId: string;                  // Template to evaluate with
  templateName: string;                // Template name (cached)
  questions: Question[];               // Full question definitions
  startTime: number;                   // Unix timestamp
  plannedDuration: number;             // Duration in seconds
  group?: string;                      // Optional group
  taskId?: string;                     // Reference to task
  taskName?: string;                   // Task name (cached)
}
```

**Purpose**: Session represents a completed work session with its evaluation responses. ActiveSession represents a session currently in progress.

---

### 3. Question & Template Interfaces

```typescript
interface Question {
  id: string;                          // Unique question identifier
  label: string;                       // Question text
  type: 'text' | 'textarea' | 'select' | 'number' | 'none'; // Input type
  options?: string[];                  // Select options
  stars?: boolean;                     // Enable star rating
  starType?: 'stars' | 'slider' | 'emoji' | 'numeric'; // Rating display
  required?: boolean;                  // Is required
  minLength?: number;                  // Minimum text length
  maxLength?: number;                  // Maximum text length
  min?: number;                        // Minimum number value
  max?: number;                        // Maximum number value
  pattern?: string;                    // Regex pattern validation
  customValidator?: (value: string) => boolean; // Custom validation function
}

interface Template {
  id: string;                          // Template identifier
  name: string;                        // Template name
  description: string;                 // Template description
  questions: Question[];               // Array of questions
}
```

**Purpose**: Templates define reusable questionnaires with customizable questions and validation rules.

---

### 4. Reward Interfaces

```typescript
interface Reward {
  id: string;                          // Unique reward identifier
  name: string;                        // Reward name
  emoji: string;                       // Emoji representation
  description: string;                 // Reward description
  starCost: number;                    // Stars required to purchase
  image?: string;                      // Optional image URL or base64
  cooldownEndsAt?: number;             // Unix timestamp when cooldown expires
}

interface PurchaseRecord {
  id: string;                          // Purchase transaction ID
  rewardId: string;                    // Reference to reward
  rewardName: string;                  // Reward name (cached)
  starsCost: number;                   // Stars spent
  purchasedAt: number;                 // Unix timestamp
  cooldownEndsAt: number;              // 24-hour cooldown end time
}

type RewardState = 'locked' | 'affordable' | 'cooldown';
```

**Purpose**: Reward system allows users to purchase items with earned stars. Cooldown prevents spam purchases.

---

### 5. Tutorial State Interface

```typescript
interface TutorialStep {
  id: string;                          // Step identifier
  title: string;                       // Step title
  description: string;                 // Step description
  page: string;                        // Page URL for this step
  elementId: string;                   // DOM element to highlight
  position: 'top' | 'bottom' | 'left' | 'right'; // Tooltip position
}

interface TutorialState {
  isActive: boolean;                   // Is tutorial running
  currentStepIndex: number;            // Current step (0-based)
  completedSteps: string[];            // Array of completed step IDs
  skipped: boolean;                    // Did user skip tutorial
}
```

**Purpose**: Tutorial system guides new users through the application workflow.

---

## STATE MANAGEMENT (SVELTE STORES)

### 1. sessionStore.ts

**Purpose**: Manages all sessions and the active session lifecycle.

#### Writable Stores

```typescript
// All completed sessions
const sessions: Writable<Session[]>

// Current session being worked on
const activeSession: Writable<ActiveSession | null>
```

#### Derived Stores

```typescript
// Aggregate statistics derived from sessions
const sessionStats: Derived<{
  totalSessions: number,
  totalQuestions: number,
  averageRating: number,
  averageDuration: number,
  byTask: { [taskId: string]: SessionStats }
}>
```

#### Key Methods

- `createActiveSession(template, taskId)`: Start a new session
- `endSession(responses, overallRating)`: Complete session with responses
- `cancelActiveSession()`: Abandon active session without saving
- `updateSession(id, updates)`: Modify existing session
- `deleteSessionsByTask(taskId)`: Remove all sessions for a task
- `clearAll()`: Reset all data

#### Persistence
- **LocalStorage Keys**: `sessions`, `activeSession`
- **Auto-sync**: On every store subscription change
- **Migration**: Converts legacy session names to "Session N" format on load

---

### 2. taskStore.ts

**Purpose**: Manages task creation, editing, and completion.

#### Writable Store

```typescript
const tasks: Writable<Task[]>  // All user tasks
```

#### Key Methods

- `addTask(task)`: Create new task with auto-generated ID and timestamp
- `updateTask(id, updates)`: Modify task properties
- `removeTask(id)`: Delete task
- `reorderTasks(reordered)`: Change task order
- `completeTask(id, result)`: Mark task complete with optional result
- `clearAll()`: Delete all tasks

#### Persistence
- **LocalStorage Key**: `tasks`
- **Auto-sync**: On store changes
- **Cleanup**: Strips legacy `description` field on load

---

### 3. rewards.ts

**Purpose**: Manages reward system, star balance, and purchases.

#### Writable Stores

```typescript
const starBalance: Writable<number>        // Current star count (initial: 5)
const rewards: Writable<Reward[]>          // Available rewards
const purchases: Writable<PurchaseRecord[]> // Purchase history
```

#### Derived Store

```typescript
const starBalance: Derived<number>  // Calculated as: earned - spent (never negative)
```

#### Key Methods

- `getRewardState(rewardId)`: Returns 'locked' | 'affordable' | 'cooldown'
- `purchaseReward(rewardId)`: Buy reward, apply 24hr cooldown
- `addReward(reward)`: Create custom reward
- `incrementStarBalance(amount)`: Add stars (called after session evaluation)
- `resetPurchases()`: Clear purchase history
- `clearAll()`: Reset all reward data

#### Star Calculation
- **Initial Balance**: 5 stars
- **Session Rewards**: Base 5 stars + (overallRating × 10) per session
  - Rating 1 = 15 stars
  - Rating 2 = 25 stars
  - Rating 3 = 35 stars
  - Rating 4 = 45 stars
  - Rating 5 = 55 stars
- **Cooldown**: 24 hours between purchases of same reward

#### Persistence
- **LocalStorage Keys**: `stars_balance`, `rewards_list`, `purchases_history`
- **Auto-sync**: On store changes
- **Auto-award**: Stars added when sessions complete

---

### 4. templateStore.ts

**Purpose**: Manages template selection and caching.

#### Writable Stores

```typescript
const selectedTemplate: Writable<Template | null>  // Currently selected
const templates: Writable<Template[]>              // All templates
```

#### Persistence
- **No LocalStorage**: Managed via API endpoints
- **Backend**: Stored in `src/lib/data/templates.json`
- **API**: Fetched from `/api/templates` endpoints

---

### 5. tutorialStore.ts

**Purpose**: Manages tutorial progress and state.

#### Writable Store

```typescript
const tutorial: Writable<TutorialState>
```

#### Key Methods

- `startTutorial()`: Begin tutorial from step 0
- `nextStep()`: Advance to next step
- `goToStep(index)`: Jump to specific step
- `exitTutorial()`: End tutorial
- `resetProgress()`: Clear all progress
- `markStepComplete(stepId)`: Record step completion
- `isComplete()`: Check if all steps done

#### Persistence
- **LocalStorage Key**: `tutorial_state`
- **Auto-sync**: On state changes
- **Browser-only**: Disabled on server-side rendering

---

### 6. storeStore.ts

**Purpose**: Tracks purchase history and derived star balance.

#### Writable Store

```typescript
const purchaseHistory: Writable<{
  purchases: PurchaseRecord[],
  totalStarsSpent: number
}>
```

#### Key Methods

- `recordPurchase(rewardId, cost)`: Log purchase with cooldown timestamp
- `checkCooldown(rewardId)`: Get remaining cooldown time or null
- `resetPurchases()`: Clear history

#### Derived Calculations
```typescript
// Available stars = earned - spent (never negative)
starBalance = totalEarned - totalStarsSpent
```

---

## COMPONENTS DOCUMENTATION

### UI Display Components

#### 1. StarBalance.svelte

**Purpose**: Display current star balance in header/sidebar

**Props**: None (uses stores)

**Key Features**:
- Subscribes to `starBalance` store
- Displays star emoji + count
- Real-time updates

**Usage**:
```svelte
<StarBalance />
```

---

#### 2. RewardCard.svelte

**Purpose**: Display individual reward with purchase capability

**Props**:
```typescript
reward: Reward
```

**Key Features**:
- Shows reward image or emoji
- Displays name, description, star cost
- Buy button with state-based styling
  - **Affordable**: Normal style, clickable
  - **Locked**: Greyed out (insufficient stars)
  - **Cooldown**: Disabled with countdown timer
- Hover transform animation
- Real-time balance updates

**Methods**:
- `handleBuy()`: Call purchaseReward(), show alert
- `getRewardState()`: Determine current state

**Usage**:
```svelte
<RewardCard reward={selectedReward} />
```

---

#### 3. RewardGrid.svelte

**Purpose**: Display grid of all available rewards

**Props**: None (uses stores)

**Key Features**:
- CSS Grid layout: `minmax(280px, 1fr)`
- Auto-responsive columns
- 18px gap between cards
- Subscribes to rewards store

**Usage**:
```svelte
<RewardGrid />
```

---

#### 4. SessionDetail.svelte

**Purpose**: Display completed session with all feedback

**Props**:
```typescript
session: Session
```

**Key Features**:
- Shows session metadata (template, date, duration)
- Displays all responses
- Star ratings visualized
- Text answers formatted
- Duration formatting (HH:MM:SS)

**Methods**:
- `formatDuration()`: Convert seconds to readable format
- `formatDate()`: Format timestamp to locale date

**Usage**:
```svelte
<SessionDetail session={completedSession} />
```

---

#### 5. MobileBottomNav.svelte

**Purpose**: Mobile navigation bar (hidden on desktop)

**Props**: None

**Key Features**:
- 5 main navigation links
- Route-based active state
- SVG icons
- Blur backdrop effect
- Hidden on screens > 768px
- Fixed bottom positioning

**Routes**:
1. Store (`/store`)
2. Tasks (`/tasks`)
3. Home (`/`)
4. Results (`/results`)
5. Info (`/info`)

**Usage**:
```svelte
<MobileBottomNav />
```

---

#### 6. Popup.svelte

**Purpose**: Generic modal dialog component

**Props**:
```typescript
isOpen: boolean              // Bindable
title: string               // Modal title
showCloseButton?: boolean    // Show X button
onClose?: () => void        // Close callback
children?: Slot             // Modal content
```

**Key Features**:
- Fade transition on appear
- Backdrop click-to-close
- Escape key to close
- ARIA attributes for accessibility
- Max width: 800px, max height: 90vh
- Smooth animations

**Methods**:
- `handleClose()`: Close modal and trigger callback
- `handleBackdropClick()`: Close only if clicking backdrop

**Usage**:
```svelte
<Popup bind:isOpen={showModal} title="Confirm">
  <p>Are you sure?</p>
</Popup>
```

---

### Form & Modal Components

#### 7. AddRewardButton.svelte

**Purpose**: Trigger button to open add reward modal

**Props**: None

**Key Features**:
- Large button with + icon
- Opens AddRewardModal on click
- Shows overlay backdrop
- Simple toggle mechanism

**Events**:
- `added`: Dispatched when reward created

**Usage**:
```svelte
<AddRewardButton on:added={handleRewardAdded} />
```

---

#### 8. AddRewardModal.svelte

**Purpose**: Form for creating custom rewards

**Props**: None

**Key Features**:
- Input fields: name, emoji, description, star cost
- Image file upload with preview
- Image preview display
- Input validation
- Calls `addReward()` store function
- Auto-resets form after submission
- Backdrop click-to-close

**Methods**:
- `handleFile()`: Process image upload and generate preview
- `submit()`: Validate and create reward

**Usage**:
```svelte
<AddRewardModal bind:isOpen={showModal} on:added={handleAdded} />
```

---

#### 9. CreateTemplate.svelte

**Purpose**: Create or edit evaluation templates

**Props**:
```typescript
initialTemplate?: Template  // For edit mode
isEditMode?: boolean        // Edit vs create
```

**Key Features**:
- Dynamic question builder
- Add/remove questions
- Question type selector
- Star rating toggle
- Option management for select questions
- Template preview modal
- Form validation
- API integration (POST for create, PUT for edit)
- Redirect on success

**Methods**:
- `addQuestion()`: Insert new question
- `removeQuestion()`: Delete question (with constraints)
- `toggleStars()`: Enable/disable ratings
- `openPreview()`: Show template preview
- `saveTemplate()`: Submit to API
- `validateQuestion()`: Validate single question

**Usage**:
```svelte
<CreateTemplate isEditMode={false} />
```

---

#### 10. EvaluationQuestionnaire.svelte

**Purpose**: Dynamic questionnaire form with validation

**Props**:
```typescript
template: Question[]        // Questions to render
handleSubmit: (responses) => void  // Submit callback
```

**Key Features**:
- Multiple question types (text, textarea, select, number)
- Multiple rating types (stars, slider, emoji, numeric)
- Real-time field validation
- Error messages displayed below fields
- Prevent submit if validation fails
- Rating display with emojis/text
- Required field indicators

**Rating Types**:
- **Stars**: 1-5 star display
- **Slider**: Horizontal slider
- **Emoji**: Emoji scale (😢 🙁 😐 🙂 😊)
- **Numeric**: Number input 1-5

**Methods**:
- `setRating()`: Update rating response
- `updateAnswer()`: Update text response
- `validateField()`: Validate individual field
- `validateAllFields()`: Pre-submit validation
- `submitForm()`: Handle submission with validation
- `getEmojiForRating()`: Map rating to emoji
- `getRatingLabel()`: Map rating to text (Poor → Excellent)

**Usage**:
```svelte
<EvaluationQuestionnaire 
  template={questions}
  handleSubmit={processResponses}
/>
```

---

#### 11. TemplateSelector.svelte

**Purpose**: Select and configure template for session

**Props**:
```typescript
templates: Template[]
selectedId?: string
onSelect?: (template, duration) => void
```

**Key Features**:
- Template grid display
- Duration slider (1-120 minutes)
- Template preview
- Icon indicators for question types
- Rating type display
- Question count
- Select button confirms choice

**Methods**:
- `openPreview()`: Show template details
- `selectTemplate()`: Confirm selection
- `formatDuration()`: Display readable duration

**Usage**:
```svelte
<TemplateSelector 
  templates={allTemplates}
  onSelect={handleSelect}
/>
```

---

#### 12. TemplateSelectorModal.svelte

**Purpose**: Modal variant of template selector

**Props**:
```typescript
isOpen: boolean
templates: Template[]
onSelect: (template, duration) => void
onCancel: () => void
```

**Key Features**:
- Modal overlay
- Template grid
- Duration slider integrated
- Escape key to close
- Backdrop click-to-close
- Focus management

**Usage**:
```svelte
<TemplateSelectorModal 
  bind:isOpen={showSelector}
  templates={templates}
  on:select={handleSelect}
  on:cancel={handleCancel}
/>
```

---

### Workflow & Management Components

#### 13. SessionManager.svelte

**Purpose**: Orchestrate entire session workflow

**Props**: None (uses stores)

**Key Features**:
- State machine: idle → active → evaluation → results
- Start Session button (idle state)
- SessionTimer display (active)
- EvaluationQuestionnaire modal (after end)
- SessionGraphs display (final state)

**Methods**:
- `handleStartSession()`: Show template selector
- `handleTemplateSelect()`: Start session with template
- `handleEndSession()`: Show questionnaire
- `handleQuestionnaireSubmit()`: Save session, show graphs
- `handleCancelSession()`: Cancel active session
- `closeGraphs()`: Reset to idle

**Always Uses**: "Distraction" evaluation template

**Usage**:
```svelte
<SessionManager />
```

---

#### 14. SessionTimer.svelte

**Purpose**: Display and manage countdown timer

**Props**:
```typescript
session: ActiveSession
onEnd: () => void  // Called when time runs out
```

**Key Features**:
- MM:SS countdown display
- 1-second interval updates
- Auto-end at zero
- Manual end button
- Animated pulse effect
- Session info display
- Cleanup on destroy

**Methods**:
- Interval-based countdown
- Auto-end trigger

**Usage**:
```svelte
<SessionTimer session={activeSession} onEnd={handleEnd} />
```

---

#### 15. Tasks.svelte

**Purpose**: Main task management page

**Props**: None (uses stores)

**Key Features**:
- Create new task button
- Active tasks section
- Completed tasks section
- Task cards for each task
- Start session for task
- Edit task
- Delete task with confirmation
- Collapsible sections
- Loading states
- Modal management
- Keyboard focus management

**Methods**:
- `openCreate()`: Show create modal
- `createTask()`: Add task to store
- `startSessionFromCard()`: Show template selector
- `handleTemplateSelect()`: Start session
- `editTask()`: Navigate to edit
- `deleteTask()`: Remove with confirmation

**Usage**:
```svelte
<Tasks />
```

---

#### 16. TutorialManager.svelte

**Purpose**: Control tutorial flow and element highlighting

**Props**: None (uses stores)

**Key Features**:
- Subscribe to tutorial store
- Find target elements
- Position tooltip correctly
- Add highlight CSS class
- Navigate to tutorial pages
- Scroll elements into view
- Handle step changes

**Methods**:
- `handleStepChange()`: Update tutorial UI for current step

**Usage**:
```svelte
<!-- Place in root layout -->
<TutorialManager />
```

---

#### 17. TutorialTooltip.svelte

**Purpose**: Animated tooltip for tutorial steps

**Props**:
```typescript
isOpen: boolean
title: string
description: string
position: 'top' | 'bottom' | 'left' | 'right'
onNext?: () => void
onSkip?: () => void
step?: number
totalSteps?: number
showSkip?: boolean
highlightElement?: string
```

**Key Features**:
- Gradient background
- Dynamic arrow pointer
- Fly-in animation
- Step progress display (e.g., "2/5")
- Next/Skip buttons
- Final step shows "Got it!" button
- ARIA attributes
- Responsive max-width

**Usage**:
```svelte
<TutorialTooltip 
  isOpen={true}
  title="Welcome"
  description="Create your first task"
  position="top"
  step={1}
  totalSteps={5}
  on:next={nextStep}
/>
```

---

#### 18. TaskCard.svelte

**Purpose**: Display individual task with statistics

**Props**:
```typescript
task: Task
loading?: boolean
```

**Key Features**:
- Task name and goal
- Session count
- Average rating
- Average duration
- Start session button
- Edit button
- Delete button
- Mobile-responsive
- Derived statistics
- Real-time updates from sessionStore

**Methods**:
- `onStart()`: Dispatch start event
- `onEdit()`: Navigate to edit page
- `onDelete()`: Dispatch delete event
- `truncate()`: Limit text to 120 chars
- `formatDuration()`: Convert seconds to readable

**Usage**:
```svelte
<TaskCard task={task} on:start={handleStart} />
```

---

#### 19. SessionGraphs.svelte

**Purpose**: Display session analytics and charts

**Props**:
```typescript
showTable?: boolean
onViewDetails?: (session) => void
```

**Key Features**:
- Summary statistics (total sessions, questions, avg rating, avg duration)
- SVG line chart for ratings over time
- SVG line chart for durations over time
- Optional session table view
- Derived data from sessionStats store
- Grid layout
- Interactive session details

**Methods**:
- `generateLinePath()`: Create SVG line chart path
- `formatDuration()`: Convert seconds to readable format

**Usage**:
```svelte
<SessionGraphs showTable={true} />
```

---

## ROUTING & PAGES

### 1. Home Page (`/`)

**File**: `src/routes/+page.svelte`

**Purpose**: Dashboard and primary landing page

**Components Used**:
- SessionManager (main workflow)
- Session graphs
- Quick task access

**Key Features**:
- Active session display with timer
- Welcome popup on first visit
- Session analytics overview
- Quick actions

---

### 2. Tasks List (`/tasks`)

**File**: `src/routes/tasks/+page.svelte`

**Purpose**: Main task management interface

**Components Used**:
- Tasks (container)
- TaskCard (per task)
- AddTaskModal
- TemplateSelector

**Key Features**:
- Create new tasks
- View all tasks (active + completed)
- Start sessions
- Edit/delete tasks
- Session counts per task

---

### 3. Task Detail (`/tasks/[id]`)

**File**: `src/routes/tasks/[id]/+page.svelte`

**Purpose**: Detailed view and management of single task

**Key Features**:
- Task information display
- Session history for this task
- Start new session button
- Complete task button
- Session expansion/detail view

---

### 4. Evaluation (`/evaluation`)

**File**: `src/routes/evaluation/+page.svelte`

**Purpose**: Questionnaire form after session completion

**Components Used**:
- EvaluationQuestionnaire

**Key Features**:
- Dynamic questions from template
- Multiple response types
- Form validation
- Submission handling

---

### 5. Results (`/results`)

**File**: `src/routes/results/+page.svelte`

**Purpose**: Comprehensive analytics and session history

**Components Used**:
- SessionGraphs
- Session detail display
- Search/filter

**Key Features**:
- Session statistics
- Expandable task groups
- Search by task name/goal
- Session details panel
- Charts and visualizations

---

### 6. Store (`/store`)

**File**: `src/routes/store/+page.svelte`

**Purpose**: Reward redemption interface

**Components Used**:
- StarBalance
- RewardGrid
- RewardCard
- AddRewardButton

**Key Features**:
- Display current stars
- Show all available rewards
- Purchase rewards
- Create custom rewards
- Cooldown management

---

### 7. Info (`/info`)

**File**: `src/routes/info/+page.svelte`

**Purpose**: Application information and settings

**Key Features**:
- Comprehensive "How to Use" guide (7-step pipeline)
- About section
- Contact information
- Privacy statement
- Data management (export/import/clear)
- Tutorial reset option

---

### 8. Templates (`/templates/view`)

**File**: `src/routes/templates/view/+page.svelte`

**Purpose**: Browse and manage evaluation templates

**Key Features**:
- Template list
- Preview modal
- Edit button
- Delete with confirmation
- Create new template button

---

### 9. Create Template (`/templates/create`)

**File**: `src/routes/templates/create/+page.svelte`

**Purpose**: Create new evaluation template

**Components Used**:
- CreateTemplate (in create mode)

**Key Features**:
- Question builder interface
- Save to backend
- Redirect on success

---

### 10. Edit Template (`/templates/edit/[id]`)

**File**: `src/routes/templates/edit/[id]/+page.svelte`

**Purpose**: Modify existing template

**Components Used**:
- CreateTemplate (in edit mode)

**Key Features**:
- Load template from store or API
- Modify questions
- Save changes
- Fallback to API if not in cache

---

### 11. Global Layout (`+layout.svelte`)

**File**: `src/routes/+layout.svelte`

**Purpose**: Root app wrapper

**Components Used**:
- TutorialManager (global)
- MobileBottomNav
- Header/Navigation

**Key Features**:
- CSS imports
- Tutorial system
- Mobile navigation
- Global header

---

## API ENDPOINTS

### 1. GET/POST Templates

**Route**: `/api/templates/+server.ts`

**GET** - Retrieve all templates
```typescript
Response: Template[]
```

**POST** - Create new template
```typescript
Request: Omit<Template, 'id'>
Response: Template (with generated id)
```

**Implementation**:
- Reads from `src/lib/data/templates.json`
- Creates file if doesn't exist
- Persists to filesystem

---

### 2. GET/PUT/DELETE Template by ID

**Route**: `/api/templates/[id]/+server.ts`

**GET** - Retrieve specific template
```typescript
Response: Template
```

**PUT** - Update template
```typescript
Request: Template
Response: Template
```

**DELETE** - Remove template
```typescript
Response: { success: boolean }
Constraint: Cannot delete if it's the last template
```

**Implementation**:
- Validates template exists
- Prevents deletion of final template
- Updates `templates.json`

---

## STYLING & THEME

### Color Scheme

The application uses a purple-based theme defined in `src/app.css`:

```css
:root {
  /* Primary Colors */
  --color-accent: #7b68a6;            /* Purple accent */
  --color-accent-hover: #6a5890;      /* Darker purple */
  --color-accent-active: #5a4880;     /* Active state */
  --color-primary: #7b68a6;           /* Primary purple */
  
  /* Background Colors */
  --color-bg-primary: #4f4973;        /* Dark purple background */
  --color-bg-secondary: #f5f0e8;      /* Light cream background */
  --color-card-bg: #ffffff;           /* White cards */
  
  /* Text Colors */
  --color-text-primary: #2c2541;      /* Dark text */
  --color-text-secondary: #6b5e7c;    /* Secondary text */
  --color-text-on-dark: #f5f0e8;      /* Light text on dark */
  
  /* Border & UI */
  --color-border: #8b7e9d;            /* Border color */
  --color-border-focus: #a094b7;      /* Focus state */
  
  /* Status Colors */
  --color-success: #7b9c6e;           /* Green success */
  --color-danger: #c17a74;            /* Red danger */
  --color-info: #8fa8c4;              /* Blue info */
  --color-warning: #e8b339;           /* Yellow warning */
}
```

### Utility Classes

**Input Fields**:
```css
.input-field {
  width: 100%;
  background: var(--color-input-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
```

**Buttons**:
- Primary: Purple background with hover effect
- Secondary: Bordered button
- Danger: Red background with confirmation
- Disabled: Greyed out state

**Responsive Design**:
- Mobile breakpoint: 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

---

## DATA PERSISTENCE

### LocalStorage Keys

| Key | Purpose | Structure |
|-----|---------|-----------|
| `sessions` | All completed sessions | `Session[]` |
| `activeSession` | Current session in progress | `ActiveSession \| null` |
| `tasks` | User's tasks | `Task[]` |
| `stars_balance` | Current star count | `number` |
| `rewards_list` | Available rewards | `Reward[]` |
| `purchases_history` | Purchase records | `PurchaseRecord[]` |
| `tutorial_state` | Tutorial progress | `TutorialState` |

### Persistence Strategy

1. **Client-Side Storage**: All data stored in browser LocalStorage
2. **No Server Upload**: User data never sent to server (privacy-first)
3. **Auto-Sync**: Every store change automatically persists
4. **Initialization**: Data loaded from localStorage on app startup
5. **Migration**: Legacy data formats converted on load
6. **Cleanup**: Invalid data cleared with error logging

### Data Export/Import

**Info Page Features**:
- Export all data as JSON
- Import previously exported data
- Clear all data (with confirmation)
- Privacy statement about local storage

---

## USER WORKFLOWS

### Workflow 1: Create Task & Start Session

```
1. Navigate to /tasks
2. Click "Create New Task" button
3. Enter task name (required) and goal (optional)
4. Click "Create Task"
   → Task appears in "In Progress" section
5. Hover over task card and click "Start Session"
   OR Click "Details" → "Start New Session"
   → TemplateSelectorModal opens
6. Select template (defaults to "Distraction Evaluation")
7. Adjust duration slider (1-120 minutes)
8. Click "Start" button
   → Redirected to home page
   → SessionTimer starts countdown
9. Work while timer runs
10. Click "End Session" when done
    → Evaluation questionnaire displays
11. Answer evaluation questions
    → Choose from template questions or custom
    → Provide ratings/text responses
    → Optional: Add notes or group sessions
12. Submit evaluation
    → Session saved to store
    → Results/graphs displayed
    → Stars earned and added to balance
```

### Workflow 2: Complete Task & View Results

```
1. From task detail page, complete work sessions
2. When finished with task, click "Finish Task" button
3. Modal asks "How did the task go?"
4. Enter result/feedback (e.g., "Passed with 85%")
5. Click "Mark as Complete"
   → Task moved to "Completed" section
   → Cannot start new sessions for this task
   → Session history still viewable
6. Navigate to /results to view analytics
7. Search/filter tasks
8. Expand task to see all sessions
9. Click session to view full details and responses
10. Edit session group/notes as needed
```

### Workflow 3: Earn & Redeem Rewards

```
1. Complete sessions with evaluation ratings
   → Rating 1 star = 15 stars earned
   → Rating 5 stars = 55 stars earned
2. Navigate to /store
3. View current star balance (top of page)
4. Browse available rewards in grid
5. Reward card shows:
   - Reward name and emoji/image
   - Description
   - Star cost
   - State: Affordable / Locked / On Cooldown
6. Click "Buy" on affordable reward
   → Stars deducted from balance
   → 24-hour cooldown applied
   → Can purchase again after cooldown
7. Optional: Create custom reward
   → Click "Add Reward" button
   → Fill in: Name, emoji, description, star cost
   → Upload optional image
   → Click "Create Reward"
   → New reward appears in grid
```

### Workflow 4: Tutorial/Onboarding

```
1. First time visiting app
   → Tutorial starts automatically
2. Follow step-by-step guide
3. Each step highlights relevant UI element
4. Tooltip shows description and navigation
5. Can click "Next" to continue
   OR "Skip" to exit tutorial
6. Options:
   → Complete all steps (→ "Got it!")
   → Skip at any time (→ Exit tutorial)
7. Tutorial progress saved to localStorage
8. Can restart tutorial from /info page
```

---

## TESTING & QUALITY ASSURANCE

### End-to-End Tests (Playwright)

Located in `/tests/e2e/`

| Test File | Coverage |
|-----------|----------|
| `home.spec.ts` | Home page, session timer display |
| `tasks.spec.ts` | Task creation, listing, deletion |
| `full-runthrough.spec.ts` | Complete workflow: create task → session → evaluation |
| `templates.spec.ts` | Template browsing, selection, preview |
| `templates-edit.spec.ts` | Template creation and editing |
| `evaluation.spec.ts` | Questionnaire form with validation |
| `results.spec.ts` | Analytics page, search filtering |
| `store.spec.ts` | Reward browsing, purchase, cooldown |
| `info.spec.ts` | Information page, data management |
| `404.spec.ts` | Not found error handling |

### Running Tests

```bash
# Run all e2e tests
npm run test

# Run tests with headed browser
npm run test:e2e:headed

# Run tests in UI mode
npm run test:e2e:ui
```

### Unit Tests

Svelte component tests located in `src/**/*.svelte.spec.ts`

Run with Vitest:
```bash
npm run vitest
```

---

## CONFIGURATION FILES

### 1. `svelte.config.js`

SvelteKit configuration for:
- Static adapter for hosting
- Build optimization
- Development server options

### 2. `vite.config.ts`

Vite bundler configuration including:
- **Plugins**:
  - Tailwind CSS plugin
  - SvelteKit plugin
  
- **Testing**: Vitest configuration with:
  - Browser testing for client code
  - Node environment for server code
  - Playwright integration
  - Separate test projects for client/server

### 3. `tsconfig.json`

TypeScript compiler options:
- **Strict Mode**: Enabled
- **Module Resolution**: Bundler
- **Check JS**: Enabled
- **Source Maps**: Enabled
- **Paths**: Using SvelteKit $lib alias

### 4. `playwright.config.ts`

Playwright test configuration:
- Browser: Chromium
- Base URL
- Screenshot/video on failure
- Retry logic
- Test timeout: 30 seconds

### 5. `package.json`

Project metadata and scripts:

**Key Scripts**:
```json
{
  "dev": "vite dev",                    # Start dev server
  "build": "vite build",                # Build for production
  "preview": "vite preview",            # Preview production build
  "check": "svelte-kit sync && svelte-check",  # Type check
  "test": "playwright test",            # Run e2e tests
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:ui": "playwright test --ui",
  "storybook": "storybook dev -p 6006", # Run Storybook
  "build-storybook": "storybook build", # Build Storybook
  "format": "prettier --write .",       # Format code
  "lint": "prettier --check ."          # Check formatting
}
```

---

## DEVELOPMENT SETUP

### Prerequisites

- **Node.js**: v18 or newer
- **npm**: Comes with Node.js
- **Git**: For version control

### Installation

```bash
# 1. Clone repository
git clone https://github.com/itcOnlineGaming/Team_1_2025.git
cd Team_1_2025/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:5173/Team_1`

### Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Type check (no compile)
npm check

# Watch mode type checking
npm run check:watch

# Format code with Prettier
npm run format

# Check if formatting matches
npm run lint

# Run e2e tests
npm run test

# Run tests with headed browser
npm run test:e2e:headed

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run Storybook
npm run storybook

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure for Development

**Working on Components**:
- Create new files in `src/lib/components/`
- Use TypeScript (.svelte files)
- Export from `src/lib/index.ts`
- Add Storybook stories in `src/stories/`

**Adding Stores**:
- Create in `src/lib/stores/`
- Export from store files
- Subscribe in components using `$store` syntax

**Adding Routes/Pages**:
- Create folder in `src/routes/`
- Add `+page.svelte` for page content
- Add `+layout.svelte` for layouts
- Add `+server.ts` for API endpoints

**Styling**:
- Use Tailwind CSS classes where possible
- Add component-specific CSS in `<style>` blocks
- CSS variables available for theming

**Testing**:
- Create `.spec.ts` files in `tests/e2e/`
- Use Playwright test syntax
- Run tests frequently during development

---

## ADDITIONAL NOTES

### Browser Compatibility

- Modern browsers with LocalStorage support
- Tested on Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Android Chrome)

### Performance Considerations

- Store subscriptions are efficient with Svelte reactivity
- LocalStorage limited to ~5-10MB per domain
- SVG charts render efficiently
- Lazy loading via SvelteKit routing

### Security Considerations

- All data stored locally—no external API calls
- No sensitive data in localStorage (optional hashing available)
- HTTPS recommended for deployment
- CSP headers for XSS protection

### Future Enhancement Possibilities

- Backend storage option
- Data synchronization across devices
- Export to CSV/PDF
- Mobile app with React Native
- Advanced analytics dashboard
- Collaborative features
- AI-powered insights

---

## CONCLUSION

Activity Tracker is a comprehensive, well-structured application for session tracking and productivity analysis. The codebase demonstrates modern web development practices with SvelteKit, TypeScript, and comprehensive testing. All data remains private and stored locally in the user's browser, making it ideal for academic research while maintaining strict privacy standards.

For questions or contributions, refer to the main repository at: https://github.com/itcOnlineGaming/Team_1_2025

---

**Document Compiled**: December 7, 2025  
**Coverage**: 100% of application components, stores, and features  
**Status**: Comprehensive and up-to-date
