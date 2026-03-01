# SAGA OS - Complete System UI/UX Behavior Specification

> **Purpose**: This document is the authoritative reference for SAGA OS's current implementation. Use it as context when making changes, adding features, or debugging. It describes every view, component, data model, interaction pattern, theming system, and design decision in the codebase.

---

## 1. Project Overview

SAGA OS is a multi-agent orchestration dashboard for a solo operator managing AI agent crews, projects, sessions, revenue, and shared memory pools. It is designed to feel like "mission control from the future" - a glassmorphic interface where the background itself communicates system state through ambient phase-based gradients, agents have Figma-style colored presence rings, and revenue data is presented as an emotional motivation engine with streak tracking and milestone gamification.

**Current state**: Fully implemented frontend with static/mock data across 6 views. Full light/dark theme support via CSS custom properties. No backend integration. All views render in a single `App.tsx` with view switching managed by Zustand.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 | Peer dependency |
| Styling | Tailwind CSS v4 | No `tailwind.config.js` - uses CSS-based config in `/src/styles/theme.css` |
| State | Zustand v5 | Single store at `/src/app/stores/useSystemStore.ts` |
| Animation | Motion (formerly Framer Motion) | Import as `import { motion } from 'motion/react'` |
| Charts | Recharts v2 | `AreaChart`, `BarChart`, `ResponsiveContainer` (explicit px heights: `96` and `256`) |
| Command Palette | cmdk v1 | Wrapped via shadcn/ui `CommandDialog` component |
| UI Primitives | Radix UI / shadcn/ui | Full component library in `/src/app/components/ui/` |
| Icons | lucide-react | Used throughout all views |
| Build | Vite 6 | With `@tailwindcss/vite` plugin |

**Installed but not yet actively used**: `@tremor/react`, `react-dnd`, `react-router`, `@mui/material`, `react-resizable-panels`

---

## 3. File Structure

```
/src
  /app
    App.tsx                          # Main component - ALL 6 views + Sidebar + ambient background
    /components
      CommandPalette.tsx             # Cmd+K command palette (navigation + quick actions + theme toggle)
      GlassCard.tsx                  # Reusable glassmorphic card component (CSS-variable-driven)
      /ui                           # Full shadcn/ui component library (47 components)
        command.tsx                  # cmdk wrapper used by CommandPalette
        utils.ts                    # cn() utility (clsx + tailwind-merge)
        [... 45 more shadcn components]
      /figma
        ImageWithFallback.tsx        # Protected - do not modify
    /stores
      useSystemStore.ts             # Zustand store with all mock data, state, and theme management
  /imports
    saga-os-design-patterns.md      # Authoritative design patterns document (UI/UX bible)
    saga-sidebar.tsx                # Reference sidebar implementation
    SAGA-OS-SPEC.md                 # This specification document
  /styles
    fonts.css                       # Font imports only
    index.css                       # Main CSS entry
    tailwind.css                    # Tailwind directives
    theme.css                       # CSS custom properties: shadcn tokens + SAGA OS theme tokens (light/dark)
```

---

## 4. Theming System

### 4.1 Architecture Overview

SAGA OS implements a full light/dark mode system using three layers:

1. **CSS Custom Properties** (`/src/styles/theme.css`): 25+ `--saga-*` tokens defined for both `:root` (light) and `.dark` (dark) scopes
2. **Zustand State** (`useSystemStore.ts`): `theme: 'light' | 'dark'` state with `toggleTheme()` action that toggles the `.dark` class on `document.documentElement`
3. **Theme Style Helpers** (`App.tsx`): A `t` object with pre-built `React.CSSProperties` objects for the most common text/surface patterns, referenced as `style={t.text}` etc.

### 4.2 Theme Initialization

On mount, the root `App` component runs a `useEffect` that applies or removes the `.dark` class on `<html>` based on the current Zustand `theme` value. Default is `'dark'`.

```tsx
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, []);
```

The `toggleTheme()` Zustand action also manipulates the DOM class directly for immediate reactivity:

```tsx
toggleTheme: () => set((state) => {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  if (next === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return { theme: next };
}),
```

### 4.3 SAGA OS CSS Custom Properties

All SAGA-specific tokens are prefixed `--saga-*` to avoid collision with shadcn/ui's existing tokens. Defined in `/src/styles/theme.css`:

**Surface & Background Tokens:**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--saga-bg` | `#F0F2F8` (cool off-white) | `#0A0A0A` (near-black) | Root app background |
| `--saga-surface` | `rgba(255,255,255,0.65)` | `rgba(255,255,255,0.03)` | GlassCard default background |
| `--saga-surface-hover` | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.06)` | GlassCard hover state |
| `--saga-surface-dim` | `rgba(0,0,0,0.025)` | `rgba(255,255,255,0.02)` | Column backgrounds, very subtle containers |
| `--saga-surface-active` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.09)` | Active nav item background |

**Border Tokens:**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--saga-border` | `rgba(0,0,0,0.10)` | `rgba(255,255,255,0.08)` | Standard borders |
| `--saga-border-subtle` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` | Subtle borders |
| `--saga-border-strong` | `rgba(0,0,0,0.18)` | `rgba(255,255,255,0.2)` | Dashed borders, CTAs |
| `--saga-inset-shadow` | `rgba(255,255,255,0.6)` | `rgba(255,255,255,0.05)` | GlassCard top-edge light catch |

**Text Tokens (6-level hierarchy):**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--saga-text` | `#1A1B2E` | `#ffffff` | Primary text: headings, values, names |
| `--saga-text-strong` | `rgba(26,27,46,0.85)` | `rgba(255,255,255,0.8)` | Strong body text, activity messages |
| `--saga-text-secondary` | `rgba(26,27,46,0.6)` | `rgba(255,255,255,0.6)` | Body text, descriptions, column headers |
| `--saga-text-muted` | `rgba(26,27,46,0.5)` | `rgba(255,255,255,0.5)` | KPI labels, subtitles, sub-descriptions |
| `--saga-text-faint` | `rgba(26,27,46,0.38)` | `rgba(255,255,255,0.4)` | Timestamps, progress labels, counters |
| `--saga-text-ghost` | `rgba(26,27,46,0.22)` | `rgba(255,255,255,0.3)` | Keyboard shortcut text, empty states, token counts |

**Component-Specific Tokens:**

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--saga-sidebar-bg` | `rgba(255,255,255,0.65)` | `rgba(0,0,0,0.6)` | Sidebar background |
| `--saga-sidebar-border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.1)` | Sidebar right border |
| `--saga-kbd-bg` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.1)` | Keyboard shortcut badge backgrounds |
| `--saga-progress-bg` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.1)` | Progress bar track backgrounds |
| `--saga-chart-axis` | `rgba(26,27,46,0.3)` | `rgba(255,255,255,0.25)` | Recharts axis stroke color |
| `--saga-tooltip-bg` | `#ffffff` | `#1a1a1a` | Chart tooltip background |
| `--saga-tooltip-border` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Chart tooltip border |
| `--saga-gradient-opacity` | `0.12` | `1` | Ambient gradient intensity multiplier |
| `--saga-logo-text` | `#1A1B2E` | `#ffffff` | "SAGA OS" wordmark color |

### 4.4 Theme Style Helpers (`t` Object)

A constant `t` object in `App.tsx` provides pre-built `React.CSSProperties` objects for the most commonly used theme tokens, eliminating verbose inline `style={{ color: 'var(--saga-text)' }}` throughout JSX:

```tsx
const t = {
  text:          { color: 'var(--saga-text)' },
  textStrong:    { color: 'var(--saga-text-strong)' },
  textSecondary: { color: 'var(--saga-text-secondary)' },
  textMuted:     { color: 'var(--saga-text-muted)' },
  textFaint:     { color: 'var(--saga-text-faint)' },
  textGhost:     { color: 'var(--saga-text-ghost)' },
  border:        { borderColor: 'var(--saga-border)' },
  borderStrong:  { borderColor: 'var(--saga-border-strong)' },
  surfaceDim:    { backgroundColor: 'var(--saga-surface-dim)' },
  surfaceActive: { backgroundColor: 'var(--saga-surface-active)' },
  progressBg:    { backgroundColor: 'var(--saga-progress-bg)' },
  kbdBg:         { backgroundColor: 'var(--saga-kbd-bg)' },
};
```

Usage pattern: `<div style={t.text}>` or combined with dynamic styles: `style={{ ...t.textFaint, ...otherStyles }}`

### 4.5 Theme Toggle Access Points

Users can toggle the theme via two mechanisms:

1. **Sidebar Button**: A Sun/Moon icon button at the bottom of the sidebar (above the footer hint). Shows "Light Mode" or "Dark Mode" label when sidebar is expanded. Uses the same hover interaction pattern as nav items.

2. **Command Palette**: The first item in the "Quick Actions" group: "Switch to Light/Dark Mode" with a Sun/Moon icon. Closes the palette after toggling.

### 4.6 Ambient Gradient Theme Adaptation

The ambient background gradients that respond to `currentPhase` use a theme-aware opacity multiplier:
- **Dark mode**: Full opacity (`1x`) - gradients are vivid against the near-black background
- **Light mode**: Reduced opacity (`0.12x`) - gradients become subtle pastel washes against the light background

Implementation uses a `getGradientColor()` helper that replaces a `VAR` placeholder in the gradient color templates with the computed opacity (`baseOpacity * themeMultiplier`).

### 4.7 shadcn/ui Theme Integration

The shadcn/ui components (used by CommandPalette, dialog overlays) use their own set of CSS variables (`--popover`, `--popover-foreground`, `--accent`, etc.) which are also defined for both `:root` and `.dark` in `theme.css`. These automatically switch when the `.dark` class is toggled, so the command palette dialog, tooltips, and other shadcn primitives are fully theme-aware without additional code.

### 4.8 Background Transition

The root `<div>` has `transition-colors duration-500` applied, creating a smooth 500ms crossfade when switching between light and dark backgrounds.

---

## 5. Design System

### 5.1 Semantic Color Palette

These colors are used consistently across both themes. They are applied as accent/brand colors and don't change between light and dark mode:

| Purpose | Hex | Usage |
|---------|-----|-------|
| Revenue/Success | `#00875A` | MRR, growth indicators, LAUNCH phase, SHARED memory, P1 Revenue priority |
| Build/Primary | `#0052CC` | BUILD phase, P2 project, primary actions, P2 Build priority |
| Warning/Scout | `#FF991F` | SCOUT phase, idle agents, SELECTIVE memory, P3 Maintain priority |
| Creation/Spawn | `#E91E84` / `#6554C0` | SPAWN phase, streaks, purple accents |
| Info/Autopilot | `#00B8D9` | AUTOPILOT phase secondary, info badges |
| Error/Danger | `#DE350B` | Error states, ISOLATED memory mode |
| Focus/CTA | `#FFB020` | Next Action card accent, focus rings |

**Agent presence colors** (unique per agent, defined in `AGENT_COLORS` constant in store):
```
saga: #FF6B6B, vinama: #4ECDC4, trend: #95E1D3, p2fe: #FFD93D,
p2api: #6BCF7F, p1social: #845EC2, p1health: #00C9A7, p2out: #FF9671,
p1fe: #FFB020, p1api: #3B82F6, p1seo: #8B5CF6, p1inv: #EC4899,
p1email: #F97316, p1comp: #78716C, p2deploy: #06B6D4, p2email: #F59E0B,
p1stalker: #6366F1, p2content: #14B8A6
```

### 5.2 GlassCard Component

**File**: `/src/app/components/GlassCard.tsx`

The foundational UI primitive. Every card, panel, and container in the app uses `GlassCard`.

**Props**:
- `children: ReactNode` - Card content
- `className?: string` - Additional Tailwind classes
- `hover?: boolean` - Enables lift effect (`-translate-y-0.5`, shadow increase, background brightens via JS event handlers)
- `borderAccent?: string` - Hex color for a 3px left border accent line

**Theme-aware styling** (all via CSS variables):
- Background: `var(--saga-surface)` (light: white glass, dark: subtle white tint)
- Border: `var(--saga-border)`
- Inset shadow: `0 1px 0 var(--saga-inset-shadow) inset` (top-edge light catch)
- Hover: JS `onMouseEnter`/`onMouseLeave` swap background to `var(--saga-surface-hover)`
- Blur: `backdrop-blur-xl` (16px equivalent)
- Border radius: `rounded-2xl` (16px)

### 5.3 Ambient Phase Gradients

The entire app background shifts color based on `currentPhase` in the Zustand store. Three animated radial gradient orbs float on the base background with `blur-[80px]` and slow 10-14s infinite drift animations via Motion.

| Phase | Gradient Colors | Mood |
|-------|----------------|------|
| SCOUT | Cyan `rgba(0,188,217)` + Blue `rgba(0,82,204)` | Scanning, discovery |
| SPAWN | Violet `rgba(101,84,192)` + Pink `rgba(232,30,132)` | Creation |
| BUILD | Amber `rgba(255,153,31)` + Orange `rgba(255,107,0)` | Active construction |
| LAUNCH | Emerald `rgba(0,135,90)` + Teal `rgba(0,201,167)` | Deployment |
| AUTOPILOT | Slate `rgba(71,85,105)` + Indigo `rgba(99,102,241)` | Calm autonomous |

Default phase is `BUILD`. Opacity per orb is `[0.3, 0.2, 0.1]` in dark mode, scaled down to `[0.036, 0.024, 0.012]` in light mode via the `gradientOpacityMultiplier`.

### 5.4 Typography Patterns

All text colors use `--saga-*` CSS variables via the `t` helper or direct `style` attributes:

| Element | Classes | Style | Usage |
|---------|---------|-------|-------|
| View titles | `text-2xl font-black` | `t.text` | Page headings |
| Section headers | `text-sm font-bold` | `t.text` | Card section titles |
| KPI labels | `text-[10px] font-semibold uppercase tracking-wider` | `t.textMuted` | Stat card labels |
| KPI values | `text-2xl font-black` (or `text-3xl` for hero) | `t.text` | Large numbers |
| Body text | `text-sm` | `t.textSecondary` | Descriptions, paragraphs |
| Sub-descriptions | `text-xs` | `t.textMuted` | Secondary info |
| Timestamps | `text-[10px] font-mono` | `t.textFaint` | Relative times |
| Status badges | `text-[10px] font-bold uppercase tracking-wider` | Dynamic color | Agent/priority status |
| Ghost text | `text-[9px] font-mono` | `t.textGhost` | Token counts, shortcut hints |

### 5.5 Helper Utilities

**`cn()` in App.tsx**: Simple `filter(Boolean).join(' ')` - used within App.tsx for conditional class joining.

**`cn()` in `/src/app/components/ui/utils.ts`**: Full `clsx` + `tailwind-merge` - used by shadcn/ui components.

---

## 6. State Management (Zustand Store)

**File**: `/src/app/stores/useSystemStore.ts`

### 6.1 Types

```typescript
type AgentStatus = 'active' | 'idle' | 'thinking' | 'error' | 'archived';
type MemoryMode = 'ISOLATED' | 'SHARED' | 'SELECTIVE';
type Priority = 'REVENUE' | 'BUILD' | 'MAINTAIN';
type Phase = 'SCOUT' | 'SPAWN' | 'BUILD' | 'LAUNCH' | 'AUTOPILOT';
type Theme = 'light' | 'dark';
```

### 6.2 Data Interfaces

**Agent**:
```typescript
{
  id: string;           // Short key matching AGENT_COLORS (e.g., "saga", "p2fe")
  name: string;         // Display name (e.g., "SAGA", "p2-frontend")
  role: string;         // Description (e.g., "Strategy Brain", "UI builder")
  model: 'Opus' | 'Sonnet' | 'Haiku';  // Claude model tier
  type: 'core' | 'brain' | 'spawned';  // Agent category
  mem: MemoryMode;      // Memory access level
  project: string;      // "universal", "P1", or "P2"
  avatar: string;       // Emoji avatar
  status: AgentStatus;  // Current state
  color: string;        // Unique hex color from AGENT_COLORS
}
```

**Session**:
```typescript
{
  slot: number;              // 1-8
  agent: string | null;      // Agent name or null if empty
  project: string | null;    // Project identifier
  task: string;              // Current task description
  pct: number;               // Progress percentage (0-100)
  mem: MemoryMode | null;    // Memory mode of assigned agent
  pri: Priority | null;      // Priority tier
  tokenCount?: number;       // Real-time token counter
  activitySparks?: number[]; // Last 60s activity intensity array (not yet visualized)
}
```

**Project**:
```typescript
{
  name: string;       // Display name
  phase: Phase;       // Pipeline stage
  revenue: string;    // Monthly revenue as string (e.g., "$340")
  bots: number;       // Total agents assigned
  active: number;     // Currently active agents
  color: string;      // Project accent color
  desc: string;       // Short description
  signals?: number;   // Market signals found (SCOUT phase)
  score?: number;     // Viability score percentage (SCOUT phase)
  pct?: number;       // Build progress percentage (BUILD phase)
}
```

### 6.3 Store Shape

```typescript
{
  // Navigation
  currentView: string;              // 'dash' | 'crew' | 'projects' | 'sessions' | 'revenue' | 'memory'
  setCurrentView: (view) => void;

  // Ambient background
  currentPhase: Phase;              // Default: 'BUILD'
  setCurrentPhase: (phase) => void;

  // Theme
  theme: Theme;                     // Default: 'dark'
  toggleTheme: () => void;          // Toggles theme AND .dark class on <html>

  // Command palette
  commandOpen: boolean;             // Default: false
  setCommandOpen: (open) => void;

  // Revenue
  mrr: number;                      // Current MRR: 340
  mrrHistory: number[];             // 6-month array: [0, 45, 120, 210, 290, 340]
  revenueStreak: number;            // Days: 14

  // Collections
  agents: Agent[];                  // 14 agents
  sessions: Session[];              // 8 slots (7 occupied, 1 empty)
  projects: Project[];              // 3 projects
}
```

### 6.4 Mock Data Summary

**14 Agents across 3 tiers**:
- **Core** (2): SAGA (Opus, Strategy Brain), VINAMA (Sonnet, Execution)
- **Brain** (1): trend-observer (Haiku, Market trends, `thinking` status)
- **Spawned** (11): Various project-specific agents (frontend, API, social, health, outreach, email, SEO, invoice, compliance)
- Statuses: 7 active, 5 idle, 1 thinking, 0 error, 1 archived

**8 Session Slots**: 7 occupied with active tasks, 1 empty ("Available")
- Priority distribution: 2 REVENUE, 3 BUILD, 2 MAINTAIN
- Token counts range from 450 to 3,200

**3 Projects**:
- SaaS Tracker: AUTOPILOT phase, $340/mo revenue, 16 bots
- AI Templates: BUILD phase, $0 revenue, 12 bots, 45% progress
- Micro-SaaS: SCOUT phase, $0 revenue, 3 signals, 78% viability score

---

## 7. Layout Architecture

### 7.1 Root Layout (`App.tsx` default export)

```
+----------------------------------------------------------+
| [Ambient gradient orbs - fixed, pointer-events-none]     |
| (3 blur-80px orbs, slow 10-14s drift, phase-colored,    |
|  opacity scales with theme)                               |
|                                                          |
| +--+--------------------------------------------------+  |
| |  |                                                  |  |
| |S |           <main> content area                    |  |
| |I |           (max-w-7xl, p-8)                       |  |
| |D |                                                  |  |
| |E |     AnimatePresence view transitions             |  |
| |B |     (fade + slide 20px vertical, 300ms)          |  |
| |A |                                                  |  |
| |R |                                                  |  |
| +--+--------------------------------------------------+  |
|                                                          |
| [CommandPalette overlay - Cmd+K]                         |
| [Keyboard hint - fixed bottom-right: "Cmd + K"]         |
+----------------------------------------------------------+
```

The root `<div>` uses `style={{ backgroundColor: 'var(--saga-bg)' }}` with `transition-colors duration-500` for smooth theme transitions.

### 7.2 Sidebar

**Behavior**: Auto-collapse/expand on mouse hover.
- Collapsed: `54px` wide - icon-only with centered alignment
- Expanded: `180px` wide - icons + labels + keyboard shortcut badges + theme toggle label + footer hint
- Transition: 250ms with custom ease `[0.4, 0, 0.2, 1]` via Motion `animate`
- Background: `var(--saga-sidebar-bg)` with `backdrop-blur-xl`
- Border: `1px solid var(--saga-sidebar-border)` on right edge

**Structure (top to bottom)**:
1. **Logo section**: Gradient `S` icon (blue `#60A5FA` to purple `#A78BFA`, with `0_0_12px` glow shadow) + "SAGA OS" text (expanded only, colored via `--saga-logo-text`)
2. **Divider line**: 1px, colored via `--saga-border`
3. **6 nav items**: Each with icon + label + keyboard shortcut badge
4. **Spacer** (flex-1)
5. **Theme toggle button**: Sun icon (in dark mode, shows "Light Mode") / Moon icon (in light mode, shows "Dark Mode")
6. **Footer hint**: "Press 1-6 to navigate / Cmd+K for commands" (expanded only)

**Nav items** (id, label, icon, keyboard shortcut):
1. `dash` - Dashboard - `LayoutDashboard` - `1`
2. `crew` - Crew Board - `Users` - `2`
3. `projects` - Projects - `FolderKanban` - `3`
4. `sessions` - Sessions - `TrendingUp` - `4`
5. `revenue` - Revenue - `DollarSign` - `5`
6. `memory` - Memory - `Brain` - `6`

**Nav item states** (all theme-aware via CSS variables):
- **Active**: `var(--saga-surface-active)` background, `var(--saga-text)` color, `font-weight: 700`, 2.5px blue left bar indicator
- **Inactive**: Transparent background, `var(--saga-text-secondary)` color, `font-weight: 500`
- **Hover (inactive)**: `var(--saga-surface-hover)` background, `var(--saga-text-strong)` color (applied via JS `onMouseEnter`/`onMouseLeave`)

**Keyboard shortcut badges**: `var(--saga-kbd-bg)` background, `var(--saga-text-ghost)` color, 9px monospace font

### 7.3 Bottom-Right Keyboard Hint

Fixed-position pill showing `Cmd + K for commands`:
- Background: `var(--saga-sidebar-bg)` with `backdrop-blur-sm`
- Border: `var(--saga-border)`
- Text: `var(--saga-text-faint)`
- KBD elements: `var(--saga-kbd-bg)` background, monospace font

---

## 8. Views (All 6)

### 8.1 Dashboard View (`currentView: 'dash'`)

The overview/home screen. Answers "what needs attention right now?"

**Layout** (top to bottom):
1. **Next Action Card**: Orange-accented (`#FFB020`) GlassCard with:
   - 48px orange target icon
   - Action title (emoji + bold text, `t.text`)
   - Reasoning description (`t.textSecondary`)
   - "Why this?" expandable link (orange-400)
   - "Not now" ghost button (orange-500/20 bg) + "Do it ->" solid button (orange-500 bg, white text)

2. **KPI Grid**: 6-column grid of small stat cards, each a `GlassCard` with `hover` + `borderAccent`:
   - Total Crew (count, active sub-count, blue accent `#0052CC`)
   - Active Now (count, of total, green accent `#00875A`)
   - Session Slots (X/8 format, available count, amber accent `#FF991F`)
   - MRR (dollar amount, monthly delta, green accent `#00875A`)
   - Revenue Streak (days + fire emoji, pink accent `#E91E84`)
   - Projects (count, autopilot sub-count, purple accent `#6554C0`)
   - Labels: `t.textMuted`, values: `t.text`, sub-text: `t.textFaint`

3. **Main Content Grid** (3-column):
   - **Session Monitor** (col-span-2): GlassCard containing:
     - Header: "Session Monitor" (`t.text`) + green pulsing "Live" badge
     - 4-column mini-grid of all 8 session slots
     - Each slot: bordered container using `var(--saga-border)`, occupied slots use `var(--saga-surface)`, empty use `var(--saga-surface-dim)` with dashed border
     - Slot content: slot number (`t.textFaint`), agent avatar, agent name (`t.text`), task (`t.textMuted`), progress bar (`t.progressBg` track with priority-colored fill)
     - Priority-colored 3px top border on occupied slots
   - **Revenue Quick View** (col-span-1): GlassCard with:
     - Header: "Revenue Velocity" (`t.text`)
     - Hero MRR: `text-3xl font-black` (`t.text`)
     - Growth: emerald-400 colored percentage
     - Recharts AreaChart sparkline: 96px height, green gradient fill, no axes
     - Per-project revenue breakdown: name (`t.textSecondary`) + amount (`t.text`), separated by `var(--saga-border)` divider

4. **Activity Feed**: GlassCard with:
   - Header: "Recent Activity" (`t.text`)
   - 4 activity items: agent emoji icon (on tinted background `${color}20`), message (`t.textStrong`), timestamp (`t.textFaint`, monospace)

### 8.2 Crew Board (`currentView: 'crew'`)

Kanban-style view of all agents organized by status.

**Layout**:
- Header: "Crew Board" (`t.text`) + "+ Spawn New Agent" button (blue-500/20 bg, blue-400 text)
- 4-column grid:
  1. **Active** column - Green dot header, `t.textSecondary` label, count in `t.textFaint` + `t.surfaceDim` badge
  2. **Idle** column - Orange dot header
  3. **Archived** column - Gray dot header
  4. **Agent Factories** sidebar

**Agent Card** (GlassCard with `hover`):
- Top row: Agent avatar with colored ring (`ring-2 ring-offset-2`), name (`t.text`), role (`t.textMuted`), status badge (AgentStatusBadge), model badge (agent color)
- Bottom row (separated by `var(--saga-border)` top border): Type badge (CORE/BRAIN/SPAWNED, colored), Memory mode badge (lock/globe/key icon + mode label), Project badge (agent color)

**AgentStatusBadge** component: Colored dot + uppercase label. Pulses (`animate-pulse`) for `active` and `thinking` statuses.

**ColumnHeader** sub-component: Reusable for Active/Idle/Archived columns. Dot + label (`t.textSecondary`) + count badge (`t.textFaint` on `t.surfaceDim`).

**Agent Factories** (static data):
- Vida (construction icon): 8 spawned, frontend/api/reviewer, blue accent
- Nama (megaphone): 12 spawned, email/social/leads/seo, green accent
- Atlas (globe): 6 spawned, deploy/health/db, cyan accent
- Aegis (shield): 5 spawned, compliance/invoice, red accent

### 8.3 Projects Pipeline (`currentView: 'projects'`)

5-stage Kanban pipeline visualization.

**Layout**:
- Header: "Projects Pipeline" (`t.text`) + "+ New Project" button
- 5-column grid, one per phase: SCOUT -> SPAWN -> BUILD -> LAUNCH -> AUTOPILOT

**Phase columns**:
- Header: Phase emoji + phase name (`t.textSecondary`) + count badge (`t.textFaint` on `t.surfaceDim`)
- Column body: `min-h-[400px]` with `t.surfaceDim` background
- Empty state: "No projects" centered (`t.textGhost`)

**Project Card** (GlassCard with `hover` + phase-colored `borderAccent`):
- Project name (`t.text`) + description (`t.textMuted`)
- Badge row (conditional): Revenue (emerald-500/20 bg), Bot count (blue-500/20), Signals (orange-500/20, SCOUT only), Score (purple-500/20, SCOUT only)
- Progress bar (if `pct` defined): Labels in `t.textFaint`, track in `t.progressBg`, fill in phase color

**Phase colors**: SCOUT=#FF991F, SPAWN=#E91E84, BUILD=#0052CC, LAUNCH=#00B8D9, AUTOPILOT=#00875A
**Phase icons**: telescope, factory, hammer, rocket, robot

### 8.4 Sessions Monitor (`currentView: 'sessions'`)

8-slot concurrent execution grid.

**Layout**:
- Header: "Session Monitor" (`t.text`) + subtitle (`t.textMuted`)
- **Priority Stats Row**: 3 colored pill badges (`${color}20` bg) showing count per priority (P1 Revenue green, P2 Build blue, P3 Maintain amber) + open slots counter (`t.surfaceDim` bg, `t.textFaint`)
- **Session Grid**: 4-column, 2-row grid of 8 GlassCards
- **Queue Section**: GlassCard with "Queue - Waiting for Slot" (`t.text`), 4 queued items in bordered containers

**Session Card** (occupied):
- GlassCard with priority-colored `borderAccent`, `hover` enabled
- Slot label (`t.textFaint`), agent avatar (colored ring), agent name (`t.text`), task (`t.textMuted`)
- Project badge + memory mode badge (colored pills)
- Progress: bar (`t.progressBg` track), percentage (`t.textFaint`), token count (`t.textGhost`, monospace)
- Priority badge: full-width, centered, colored background
- Hover: `scale-105` transition

**Session Card** (empty):
- GlassCard, `opacity-60`, no hover
- Slot label, "- Available -" text
- "+ Assign Agent" dashed-border CTA (`var(--saga-border-strong)` border, `var(--saga-text-faint)` text, hover: blue-500 highlight)

**Queue items**: Bordered containers (`var(--saga-border)`, `var(--saga-surface-dim)`), agent name (`t.text`), priority badge (colored), wait time (`t.textFaint`, monospace)

### 8.5 Revenue Dashboard (`currentView: 'revenue'`)

Financial metrics with gamification elements for solo operator motivation.

**Layout**:
1. **Top KPIs** (4-column grid of GlassCards with `hover` + `borderAccent`):
   - MRR ($340, +$50 delta, green `#00875A`)
   - Total Revenue ($1,005, "all time", blue `#0052CC`)
   - Subscribers (23, +4 this month, purple `#6554C0`)
   - Churn Rate (2.1%, "healthy", cyan `#00B8D9`)
   - Labels: `t.textMuted`, values: `t.text`, deltas: accent color

2. **Revenue Velocity** (3-column grid):
   - **Main Chart** (col-span-2): GlassCard with:
     - "Monthly Revenue Growth" header (`t.text`), subtitle (`t.textFaint`)
     - Growth rate displayed (`text-xl font-black text-emerald-400`)
     - Recharts AreaChart: 256px height, green gradient fill, `var(--saga-chart-axis)` strokes, theme-aware Tooltip (`var(--saga-tooltip-bg)`, `var(--saga-tooltip-border)`)
     - Projected next month below chart (`t.textMuted`)
   - **Streak & Milestones** (col-span-1), two stacked GlassCards:
     - Revenue Streak: `text-4xl font-black` count (`t.text`), "days in a row" (`t.textMuted`), fire emoji, pink accent border
     - Current Stage: "Solo Starter" (`t.text`), "$0 - $500 MRR" (`t.textMuted`), progress bar toward $500 (purple fill), percentage (purple-400)

3. **Bottom Grid** (2-column):
   - **Revenue by Project** (GlassCard): Each project: name (`t.text`) + revenue (`project.color`), progress bar (`t.progressBg` + project color fill) showing % of MRR
   - **Recent Payments** (GlassCard): 5 entries with customer email (`t.text`), type + time (`t.textFaint`), amount (`text-emerald-400`), separated by `var(--saga-border)` dividers

**Level System** (defined but only "Solo Starter" shown):
- Solo Starter: $0-$500
- Side Hustler: $500-$2K
- Indie Pro: $2K-$5K
- Ramen Profitable: $5K+
- Freedom: $10K+

### 8.6 Memory Pools (`currentView: 'memory'`)

Visual management of shared knowledge storage across agents.

**Layout**:
1. **Memory Mode Overview** (3-column grid of GlassCards with `hover` + `borderAccent`):
   - ISOLATED (lock icon, red `#DE350B`): Agent count, "Private only. No cross-access."
   - SHARED (globe icon, green `#00875A`): Count, "Reads/writes shared pools."
   - SELECTIVE (key icon, amber `#FF991F`): Count, "Private + opt-in pool access."
   - Icon: `text-3xl`, count: `text-3xl font-black` + accent color, mode name: `t.text`, description: `t.textMuted`

2. **Shared Memory Pools Grid** (2-column, 10 pools):
   GlassCards with `hover` + `borderAccent`. Each shows: pool ID (monospace, `t.text`), agent count + data size (`t.textMuted`), colored numeric badge (`${color}20` bg, color text, `text-lg font-black`).
   Pools: all-projects, market-intel, code-patterns, campaign-data, revenue-data, seo-learnings, design-system, compliance-rules, infra-state, agent-performance

3. **Uniqueness Callout**: Purple-accented (`#6554C0`) GlassCard with mask emoji, "Uniqueness != Memory Mode" title (purple-400), explanation paragraph (`t.textSecondary` with `t.text` bold highlights for SOUL.md, IDENTITY.md, Project Context, Model), closing note (`t.textMuted`).

---

## 9. Interactions & Keyboard Shortcuts

### 9.1 Global Keyboard Shortcuts

| Shortcut | Action | Implementation |
|----------|--------|----------------|
| `1` - `6` | Switch to view 1-6 | `keydown` listener in Sidebar, ignores if `metaKey`/`ctrlKey` held |
| `Cmd+K` / `Ctrl+K` | Toggle command palette | `keydown` listener in CommandPalette component |

### 9.2 Command Palette

**File**: `/src/app/components/CommandPalette.tsx`

Uses shadcn/ui `CommandDialog` wrapping `cmdk`. Two command groups:

**Navigation** (6 items): Dashboard, Crew Board, Projects, Sessions, Revenue, Memory - each navigates via `setCurrentView()` and closes palette.

**Quick Actions** (4 items):
- **Switch to Light/Dark Mode** (Sun/Moon icon) - functional, calls `toggleTheme()` and closes palette
- Spawn New Agent (Bot icon) - UI stub
- Create New Project (Target icon) - UI stub
- View Next Action (Zap icon) - UI stub

### 9.3 View Transitions

All view switches use Motion `AnimatePresence` with `mode="wait"`:
- **Enter**: `opacity: 0, y: 20` -> `opacity: 1, y: 0` (300ms)
- **Exit**: `opacity: 1, y: 0` -> `opacity: 0, y: -20` (300ms)

### 9.4 Hover & Interactive States

- **GlassCard** (when `hover` prop): `-translate-y-0.5`, `shadow-lg`, bg brightens to `var(--saga-surface-hover)` via JS event handlers
- **Session cards** (occupied): `scale-105` on hover via Tailwind
- **Nav items**: Background and text color transitions via JS event handlers (150ms Tailwind transition)
- **Theme toggle button**: Same hover pattern as nav items
- **Agent status badges**: `animate-pulse` CSS animation on `active` and `thinking` statuses
- **Ambient gradient orbs**: Continuous slow drift (`x: [0,50,0]`, `y: [0,30,0]`) with 10-14s infinite cycles
- **Sidebar expand/collapse**: 250ms width animation on mouse enter/leave

### 9.5 Theme Toggle Interaction

Two access points with identical behavior:
1. Click sidebar Sun/Moon button
2. Select "Switch to Light/Dark Mode" in command palette

Both call `toggleTheme()` which: sets Zustand state, manipulates `.dark` class on `<html>`. The CSS variables swap instantly (surfaces, text, borders), while the root background crossfades over 500ms (`transition-colors duration-500`). Ambient gradients automatically adjust opacity via the `gradientOpacityMultiplier` that reads the current `theme` state.

---

## 10. Component Patterns

### 10.1 Color Application Pattern

Dynamic accent colors (per-agent, per-project, per-priority) are applied via inline `style` attributes because they're runtime values. Common pattern:
```tsx
style={{ backgroundColor: `${color}20`, color: color }}
```
The `20` hex suffix creates a ~12.5% opacity background tint of the accent color. This works identically in both light and dark themes because it's a fixed-opacity overlay.

### 10.2 Badge Pattern

Small informational badges use this consistent pattern:
```tsx
<span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
  style={{ backgroundColor: `${color}20`, color }}>
  {icon} {label}
</span>
```
For pill-shaped: add `rounded-full`. For full-width priority labels: add centering and padding.

### 10.3 Progress Bar Pattern

```tsx
<div className="h-1.5 overflow-hidden rounded-full" style={t.progressBg}>
  <div className="h-full rounded-full transition-all"
    style={{ width: `${pct}%`, backgroundColor: color }} />
</div>
```
Track uses `var(--saga-progress-bg)` (theme-aware), fill uses dynamic accent color.

### 10.4 Section Header Pattern

```tsx
<h3 className="mb-4 text-sm font-bold" style={t.text}>Section Title</h3>
```

### 10.5 KPI Card Pattern

```tsx
<GlassCard className="p-4" hover borderAccent={color}>
  <div className="text-[10px] font-semibold uppercase tracking-wider" style={t.textMuted}>{label}</div>
  <div className="mt-1 text-2xl font-black" style={t.text}>{value}</div>
  <div className="mt-1 text-[10px]" style={t.textFaint}>{sub}</div>
</GlassCard>
```

### 10.6 Inline Border Pattern

Since `border-white/10` or similar Tailwind classes are theme-specific, borders between sections now use inline styles:
```tsx
style={{ borderTop: '1px solid var(--saga-border)' }}
style={{ borderBottom: '1px solid var(--saga-border)' }}
```

### 10.7 Hover State Pattern for Interactive Elements

Because `hover:bg-white/[0.06]` is a dark-mode-specific class, interactive elements (nav items, theme toggle) use JS-driven hover:
```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = 'var(--saga-surface-hover)';
  e.currentTarget.style.color = 'var(--saga-text-strong)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = 'transparent';
  e.currentTarget.style.color = 'var(--saga-text-secondary)';
}}
```

---

## 11. Design Patterns Reference

The authoritative design document is at `/src/imports/saga-os-design-patterns.md`. Key concepts from it that are IMPLEMENTED:

- [x] Ambient phase-based background gradients (with theme-aware opacity)
- [x] Glassmorphic card system (CSS-variable-driven surfaces, blur-16px, inset shadow)
- [x] Figma-style agent presence (unique colors, status rings, pulse animation)
- [x] 8-slot session grid with priority tiers
- [x] Command palette (Cmd+K) with navigation + quick actions + theme toggle
- [x] Revenue streak tracking and level/stage system
- [x] Next Action card on dashboard
- [x] Collapsible sidebar with keyboard shortcuts (1-6) and theme toggle
- [x] 5-phase project pipeline (SCOUT->SPAWN->BUILD->LAUNCH->AUTOPILOT)
- [x] Memory mode visualization (ISOLATED/SHARED/SELECTIVE)
- [x] Revenue velocity chart with projected trajectory
- [x] Light/dark mode with full CSS custom property system

Key concepts from it that are NOT YET IMPLEMENTED:

- [ ] Context-aware command palette (prefix modes: `>` commands, `@` agents, `$` revenue, `/` navigation)
- [ ] "Follow Agent" mode (click agent -> slide-out inspector with real-time output stream)
- [ ] Animated delegation lines between agents during handoffs
- [ ] Shift+click agent to isolate its connections
- [ ] 3-step agent creation wizard (Purpose -> Capabilities -> Configuration)
- [ ] Mini activity sparklines in session slots (data exists in store as `activitySparks`)
- [ ] Morning Brief card (time-of-day aware greeting)
- [ ] Priority stack (3 ranked actions by revenue impact)
- [ ] Skeleton loading states per view
- [ ] Notification badges on sidebar nav items
- [ ] Milestone confetti celebrations
- [ ] Animated MRR counter on page load
- [ ] MRR waterfall chart (New + Expansion - Contraction - Churn)
- [ ] Revenue-per-project ranked horizontal bar chart with 30-day sparklines
- [ ] Keyboard navigation within lists (J/K), Enter to expand, Escape to go back
- [ ] `?` keyboard shortcut overlay
- [ ] Drag-and-drop on Kanban boards
- [ ] WebSocket real-time updates architecture
- [ ] React Flow graph visualization for crew workflows
- [ ] Error boundaries per view
- [ ] Lazy loading / code splitting per view
- [ ] `aria-live` regions for real-time updates
- [ ] `role="progressbar"` with `aria-valuenow` on progress bars
- [ ] localStorage persistence for theme preference

---

## 12. Conventions & Rules

1. **All views are in App.tsx** as separate function components (DashboardView, CrewView, ProjectsView, SessionsView, RevenueView, MemoryView). View switching is done via a simple object map lookup, not React Router.

2. **No routing** - Single-page with view state in Zustand. React Router is installed but unused.

3. **GlassCard is the only card component** - Never use raw `<div>` for card-like containers. Always use `<GlassCard>`.

4. **Dynamic colors via style prop** - Because agent/project colors are runtime values, they're applied via `style={{ color, backgroundColor: color + '20' }}` rather than Tailwind classes.

5. **Theme colors via CSS variables** - All text, surface, border, and component colors that change between light/dark mode use `var(--saga-*)` tokens. Never use hardcoded `text-white`, `bg-white/X`, `border-white/X`, or `bg-[#0A0A0A]` for theme-sensitive elements.

6. **Use the `t` helper object** for common theme styles in App.tsx. Compose with spread: `style={{ ...t.text, ...otherStyles }}`.

7. **Font sizes use arbitrary values** - `text-[10px]`, `text-[9px]` are common for labels and badges. Don't use Tailwind's named font-size classes per project rules.

8. **Motion import path** - Always `import { motion, AnimatePresence } from 'motion/react'` (NOT `framer-motion`).

9. **cn() helper** - Two versions exist: a simple one at the bottom of App.tsx, and the full clsx+tailwind-merge one in `/src/app/components/ui/utils.ts`. The App.tsx one is used within App.tsx; shadcn components use the utils.ts one.

10. **Design patterns document is authoritative** - `/src/imports/saga-os-design-patterns.md` is the UI/UX bible. Consult it for any design decisions.

11. **Mock data only** - All data is hardcoded in the Zustand store. No API calls, no localStorage persistence, no WebSocket connections yet.

12. **Protected files** - Do NOT modify `/src/app/components/figma/ImageWithFallback.tsx` or `/pnpm-lock.yaml`.

13. **Recharts height fix** - Always use explicit pixel values for `ResponsiveContainer` height (e.g., `height={96}`, `height={256}`). Never use `height="100%"` as it causes console errors.

14. **Hover interactions via JS** - For theme-aware hover states on sidebar items and similar, use `onMouseEnter`/`onMouseLeave` with `var(--saga-*)` values rather than Tailwind `hover:` classes (which would require dark: variants and be less maintainable).

15. **Two theme-safe exceptions** - `text-white` is permitted on: (a) the logo "S" character (always on gradient background), (b) solid-background CTA buttons (e.g., orange "Do it ->" button). These elements have opaque backgrounds that don't change with theme.
