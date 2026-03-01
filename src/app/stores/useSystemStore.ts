import { create } from 'zustand';

// Agent colors for presence system
export const AGENT_COLORS = {
  'saga': '#FF6B6B',
  'vinama': '#4ECDC4',
  'trend': '#95E1D3',
  'p2fe': '#FFD93D',
  'p2api': '#6BCF7F',
  'p1social': '#845EC2',
  'p1health': '#00C9A7',
  'p2out': '#FF9671',
  'p1fe': '#FFB020',
  'p1api': '#3B82F6',
  'p1seo': '#8B5CF6',
  'p1inv': '#EC4899',
  'p1email': '#F97316',
  'p1comp': '#78716C',
  'p2deploy': '#06B6D4',
  'p2email': '#F59E0B',
  'p1stalker': '#6366F1',
  'p2content': '#14B8A6',
  'deployer': '#06B6D4',
  'tester': '#10B981',
  'context-bot': '#8B5CF6',
  'uiux-bot': '#A855F7',
  'explorer': '#22D3EE',
  'bot-tracker': '#F472B6',
  'competitor-watcher': '#EF4444',
  'log-analyzer': '#F97316',
  'revenue-tracker': '#10B981',
  'dev-watcher': '#7C3AED',
  'pattern-miner': '#A855F7',
} as const;

export type AgentStatus = 'active' | 'idle' | 'thinking' | 'error' | 'archived';
export type MemoryMode = 'ISOLATED' | 'SHARED' | 'SELECTIVE';
export type Priority = 'REVENUE' | 'BUILD' | 'MAINTAIN';
export type Phase = 'NEW' | 'SCOUT' | 'SPAWN' | 'BUILD' | 'LAUNCH' | 'AUTOPILOT';
export type Theme = 'light' | 'dark';

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: 'Opus' | 'Sonnet' | 'Haiku';
  type: 'core' | 'brain' | 'spawned';
  mem: MemoryMode;
  project: string;
  avatar: string;
  status: AgentStatus;
  color: string;
}

export interface Session {
  slot: number;
  agent: string | null;
  project: string | null;
  task: string;
  pct: number;
  mem: MemoryMode | null;
  pri: Priority | null;
  tokenCount?: number;
  activitySparks?: number[]; // Last 60s of activity intensity
}

export interface Project {
  name: string;
  phase: Phase;
  revenue: string;
  bots: number;
  active: number;
  color: string;
  desc: string;
  signals?: number;
  score?: number;
  pct?: number;
}

interface SystemStore {
  currentView: string;
  setCurrentView: (view: string) => void;
  
  currentPhase: Phase;
  setCurrentPhase: (phase: Phase) => void;
  
  theme: Theme;
  toggleTheme: () => void;
  
  agents: Agent[];
  sessions: Session[];
  projects: Project[];
  
  // Command palette
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  
  // Revenue
  mrr: number;
  mrrHistory: number[];
  revenueStreak: number;
}

export const useSystemStore = create<SystemStore>((set) => ({
  currentView: 'dash',
  setCurrentView: (view) => set({ currentView: view }),
  
  currentPhase: 'BUILD',
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: next };
  }),
  
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  
  mrr: 340,
  mrrHistory: [0, 45, 120, 210, 290, 340],
  revenueStreak: 14,
  
  agents: [
    { id: "saga", name: "SAGA", role: "Strategy Brain", model: "Opus", type: "core", mem: "SHARED", project: "universal", avatar: "🧠", status: "active", color: AGENT_COLORS.saga },
    { id: "vinama", name: "VINAMA", role: "Execution", model: "Sonnet", type: "core", mem: "SHARED", project: "universal", avatar: "⚡", status: "active", color: AGENT_COLORS.vinama },
    { id: "trend", name: "trend-observer", role: "Market trends", model: "Haiku", type: "brain", mem: "SHARED", project: "universal", avatar: "🔭", status: "thinking", color: AGENT_COLORS.trend },
    { id: "p2fe", name: "p2-frontend", role: "UI builder", model: "Sonnet", type: "spawned", mem: "SELECTIVE", project: "P2", avatar: "🎨", status: "active", color: AGENT_COLORS.p2fe },
    { id: "p2api", name: "p2-api", role: "Backend API", model: "Sonnet", type: "spawned", mem: "SELECTIVE", project: "P2", avatar: "⚙️", status: "active", color: AGENT_COLORS.p2api },
    { id: "p1social", name: "p1-social", role: "Social poster", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "P1", avatar: "📱", status: "active", color: AGENT_COLORS.p1social },
    { id: "p1health", name: "p1-health", role: "Uptime monitor", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "P1", avatar: "💚", status: "active", color: AGENT_COLORS.p1health },
    { id: "p2out", name: "p2-outreach", role: "Cold emails", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "P2", avatar: "📧", status: "active", color: AGENT_COLORS.p2out },
    { id: "p1fe", name: "p1-frontend", role: "UI builder", model: "Sonnet", type: "spawned", mem: "SELECTIVE", project: "P1", avatar: "🎨", status: "idle", color: AGENT_COLORS.p1fe },
    { id: "p1api", name: "p1-api", role: "Backend API", model: "Sonnet", type: "spawned", mem: "SELECTIVE", project: "P1", avatar: "⚙️", status: "idle", color: AGENT_COLORS.p1api },
    { id: "p1seo", name: "p1-seo", role: "On-page SEO", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "P1", avatar: "🔍", status: "idle", color: AGENT_COLORS.p1seo },
    { id: "p1inv", name: "p1-invoice", role: "Invoice gen", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "P1", avatar: "🧾", status: "idle", color: AGENT_COLORS.p1inv },
    { id: "p1email", name: "p1-email-bot", role: "Email drip", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "P1", avatar: "📧", status: "idle", color: AGENT_COLORS.p1email },
    { id: "p1comp", name: "p1-compliance", role: "Legal check", model: "Haiku", type: "spawned", mem: "SHARED", project: "P1", avatar: "📋", status: "archived", color: AGENT_COLORS.p1comp },
    // Custom bots — Infrastructure (Atlas)
    { id: "deployer", name: "deployer", role: "Deploy Figma exports", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "universal", avatar: "🚀", status: "active", color: AGENT_COLORS.deployer },
    { id: "tester", name: "tester", role: "Build & health checks", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "universal", avatar: "🧪", status: "active", color: AGENT_COLORS.tester },
    { id: "context-bot", name: "context-bot", role: "System state sharing", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "📡", status: "active", color: AGENT_COLORS['context-bot'] },
    { id: "monitor", name: "monitor", role: "URL health & uptime", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "universal", avatar: "💚", status: "active", color: '#10B981' },
    { id: "cleaner", name: "cleaner", role: "Cache & temp cleanup", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "universal", avatar: "🧹", status: "active", color: '#78716C' },
    { id: "backup-bot", name: "backup-bot", role: "Config & state backup", model: "Haiku", type: "spawned", mem: "ISOLATED", project: "universal", avatar: "💾", status: "active", color: '#06B6D4' },
    { id: "scheduler", name: "scheduler", role: "Task scheduling", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "📅", status: "active", color: '#14B8A6' },
    // Custom bots — Build (Vida)
    { id: "uiux-bot", name: "uiux-bot", role: "UI/UX scaffold & audit", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "universal", avatar: "🎨", status: "active", color: AGENT_COLORS['uiux-bot'] },
    { id: "git-bot", name: "git-bot", role: "Git stats & branches", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "universal", avatar: "📊", status: "active", color: '#3B82F6' },
    { id: "doc-bot", name: "doc-bot", role: "Auto-documentation", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "universal", avatar: "📝", status: "active", color: '#6366F1' },
    { id: "perf-bot", name: "perf-bot", role: "Bundle & build perf", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "universal", avatar: "⚡", status: "active", color: '#F97316' },
    { id: "sync-bot", name: "sync-bot", role: "Config sync between repos", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "universal", avatar: "🔄", status: "active", color: '#22D3EE' },
    // Custom bots — Governance (Aegis)
    { id: "dep-bot", name: "dep-bot", role: "Dependency auditing", model: "Haiku", type: "spawned", mem: "SELECTIVE", project: "universal", avatar: "📦", status: "active", color: '#F59E0B' },
    { id: "analytics", name: "analytics", role: "Performance & cost tracking", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "📈", status: "active", color: '#8B5CF6' },
    { id: "cost-bot", name: "cost-bot", role: "API cost projections", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "💰", status: "active", color: '#F59E0B' },
    // Self-learning system
    { id: "explorer", name: "explorer", role: "Web research & knowledge", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "🔍", status: "active", color: AGENT_COLORS.explorer },
    { id: "bot-tracker", name: "bot-tracker", role: "Monitor all bots", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "👁️", status: "active", color: AGENT_COLORS['bot-tracker'] },
    { id: "competitor-watcher", name: "competitor-watcher", role: "Competitor monitoring", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "🕵️", status: "active", color: AGENT_COLORS['competitor-watcher'] },
    { id: "log-analyzer", name: "log-analyzer", role: "Log analysis & error detection", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "📋", status: "active", color: AGENT_COLORS['log-analyzer'] },
    { id: "revenue-tracker", name: "revenue-tracker", role: "Income & churn tracking", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "💵", status: "active", color: AGENT_COLORS['revenue-tracker'] },
    { id: "dev-watcher", name: "dev-watcher", role: "Dev activity observer", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "👀", status: "active", color: AGENT_COLORS['dev-watcher'] },
    { id: "pattern-miner", name: "pattern-miner", role: "Extract patterns & teach bots", model: "Haiku", type: "spawned", mem: "SHARED", project: "universal", avatar: "🧬", status: "active", color: AGENT_COLORS['pattern-miner'] },
  ],
  
  sessions: [
    { slot: 1, agent: "p2-frontend", project: "P2", task: "Building dashboard UI", pct: 67, mem: "SELECTIVE", pri: "BUILD", tokenCount: 2450, activitySparks: [3, 5, 7, 8, 6, 4, 5, 9, 10, 8] },
    { slot: 2, agent: "p2-api", project: "P2", task: "REST endpoints", pct: 45, mem: "SELECTIVE", pri: "BUILD", tokenCount: 1820, activitySparks: [2, 4, 3, 5, 7, 6, 5, 4, 6, 8] },
    { slot: 3, agent: "p1-social", project: "P1", task: "Posting to X", pct: 92, mem: "ISOLATED", pri: "REVENUE", tokenCount: 980, activitySparks: [1, 2, 3, 5, 8, 9, 10, 9, 7, 5] },
    { slot: 4, agent: "p2-outreach", project: "P2", task: "Cold email batch", pct: 30, mem: "ISOLATED", pri: "REVENUE", tokenCount: 1200, activitySparks: [4, 5, 6, 7, 5, 4, 6, 7, 8, 9] },
    { slot: 5, agent: "p1-health", project: "P1", task: "Uptime check", pct: 88, mem: "ISOLATED", pri: "MAINTAIN", tokenCount: 450, activitySparks: [1, 1, 2, 1, 2, 1, 1, 2, 1, 2] },
    { slot: 6, agent: "p2-deploy", project: "P2", task: "Vercel deploy", pct: 55, mem: "SELECTIVE", pri: "BUILD", tokenCount: 890, activitySparks: [3, 4, 5, 6, 7, 8, 7, 6, 5, 7] },
    { slot: 7, agent: "trend-observer", project: "ALL", task: "Serper + HN scan", pct: 40, mem: "SHARED", pri: "MAINTAIN", tokenCount: 3200, activitySparks: [5, 6, 7, 8, 9, 8, 7, 6, 8, 9] },
    { slot: 8, agent: null, project: null, task: "Available", pct: 0, mem: null, pri: null },
  ],
  
  projects: [
    { name: "SaaS Tracker", phase: "AUTOPILOT", revenue: "$340", bots: 16, active: 4, color: "#00875A", desc: "SaaS metrics dashboard" },
    { name: "AI Templates", phase: "BUILD", revenue: "$0", bots: 12, active: 8, color: "#0052CC", desc: "Prompt template marketplace", pct: 45 },
    { name: "Telegram Remote Agent", phase: "BUILD", revenue: "$0", bots: 4, active: 3, color: "#00B8D9", desc: "Natural language system control via @Vinamabot — execute any task from Telegram", pct: 40 },
    { name: "Micro-SaaS", phase: "SCOUT", revenue: "$0", bots: 0, active: 0, color: "#FF991F", desc: "AI-powered micro tools", signals: 3, score: 78 },
  ],
}));