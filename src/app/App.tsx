import { useState, useEffect, useMemo } from 'react';
import { useSystemStore, Phase, AgentStatus } from './stores/useSystemStore';
import { CommandPalette } from './components/CommandPalette';
import { GlassCard } from './components/GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  TrendingUp,
  DollarSign,
  Brain,
  Target,
  Sparkles,
  ChevronRight,
  Activity,
  Sun,
  Moon,
  FileText,
  GitBranch,
  Network,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  Hammer,
  Plus,
  Zap,
  Monitor,
  Send,
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Theme style helpers — reusable style objects referencing CSS custom properties
const t = {
  text: { color: 'var(--saga-text)' } as React.CSSProperties,
  textStrong: { color: 'var(--saga-text-strong)' } as React.CSSProperties,
  textSecondary: { color: 'var(--saga-text-secondary)' } as React.CSSProperties,
  textMuted: { color: 'var(--saga-text-muted)' } as React.CSSProperties,
  textFaint: { color: 'var(--saga-text-faint)' } as React.CSSProperties,
  textGhost: { color: 'var(--saga-text-ghost)' } as React.CSSProperties,
  border: { borderColor: 'var(--saga-border)' } as React.CSSProperties,
  borderStrong: { borderColor: 'var(--saga-border-strong)' } as React.CSSProperties,
  surfaceDim: { backgroundColor: 'var(--saga-surface-dim)' } as React.CSSProperties,
  surfaceActive: { backgroundColor: 'var(--saga-surface-active)' } as React.CSSProperties,
  progressBg: { backgroundColor: 'var(--saga-progress-bg)' } as React.CSSProperties,
  kbdBg: { backgroundColor: 'var(--saga-kbd-bg)' } as React.CSSProperties,
};

// Phase gradient configurations
const PHASE_GRADIENTS = {
  NEW: {
    colors: ['rgba(148, 163, 184, VAR)', 'rgba(100, 116, 139, VAR)', 'rgba(148, 163, 184, VAR)'],
    opacities: [0.2, 0.15, 0.08],
    positions: ['35% 25%', '65% 55%', '45% 75%'],
  },
  SCOUT: {
    colors: ['rgba(0, 188, 217, VAR)', 'rgba(0, 82, 204, VAR)', 'rgba(0, 188, 217, VAR)'],
    opacities: [0.3, 0.2, 0.1],
    positions: ['30% 20%', '70% 60%', '50% 80%'],
  },
  SPAWN: {
    colors: ['rgba(101, 84, 192, VAR)', 'rgba(232, 30, 132, VAR)', 'rgba(101, 84, 192, VAR)'],
    opacities: [0.3, 0.2, 0.1],
    positions: ['40% 30%', '60% 70%', '30% 60%'],
  },
  BUILD: {
    colors: ['rgba(255, 153, 31, VAR)', 'rgba(255, 107, 0, VAR)', 'rgba(255, 153, 31, VAR)'],
    opacities: [0.3, 0.2, 0.1],
    positions: ['50% 30%', '70% 60%', '30% 70%'],
  },
  LAUNCH: {
    colors: ['rgba(0, 135, 90, VAR)', 'rgba(0, 201, 167, VAR)', 'rgba(0, 135, 90, VAR)'],
    opacities: [0.3, 0.2, 0.1],
    positions: ['50% 50%', '80% 40%', '20% 60%'],
  },
  AUTOPILOT: {
    colors: ['rgba(71, 85, 105, VAR)', 'rgba(99, 102, 241, VAR)', 'rgba(71, 85, 105, VAR)'],
    opacities: [0.3, 0.2, 0.1],
    positions: ['40% 40%', '60% 60%', '50% 30%'],
  },
};

function getGradientColor(template: string, opacity: number, themeMultiplier: number) {
  return template.replace('VAR', String(opacity * themeMultiplier));
}

// Agent Status Badge
function AgentStatusBadge({ status, color }: { status: AgentStatus; color: string }) {
  const configs = {
    active: { icon: '●', label: 'Active', animate: true },
    idle: { icon: '●', label: 'Idle', animate: false },
    thinking: { icon: '●', label: 'Thinking', animate: true },
    error: { icon: '●', label: 'Error', animate: false },
    archived: { icon: '●', label: 'Archived', animate: false },
  };
  
  const config = configs[status];
  
  return (
    <div className="flex items-center gap-1.5">
      <span 
        className={cn('text-xs', config.animate && 'animate-pulse')}
        style={{ color }}
      >
        {config.icon}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
        {config.label}
      </span>
    </div>
  );
}

// Sidebar Navigation
function Sidebar() {
  const { currentView, setCurrentView, theme, toggleTheme } = useSystemStore();
  const [expanded, setExpanded] = useState(false);
  
  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, shortcut: '1' },
    { id: 'crew', label: 'Crew Board', icon: Users, shortcut: '2' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, shortcut: '3' },
    { id: 'build', label: 'Build', icon: Hammer, shortcut: '4' },
    { id: 'sessions', label: 'Sessions', icon: TrendingUp, shortcut: '5' },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, shortcut: '6' },
    { id: 'memory', label: 'Memory', icon: Brain, shortcut: '7' },
  ];
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 7 && !e.metaKey && !e.ctrlKey) {
        const view = navItems[num - 1];
        if (view) setCurrentView(view.id);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  return (
    <motion.div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      initial={false}
      animate={{ width: expanded ? 180 : 54 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex h-full flex-col backdrop-blur-xl p-2 gap-0.5 overflow-hidden flex-shrink-0"
      style={{
        backgroundColor: 'var(--saga-sidebar-bg)',
        borderRight: '1px solid var(--saga-sidebar-border)',
      }}
    >
      {/* Logo */}
      <div 
        className="flex items-center gap-2.5 mb-3 transition-all duration-250"
        style={{ 
          padding: expanded ? '6px 10px' : '6px 8px',
          justifyContent: expanded ? 'flex-start' : 'center',
        }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#60A5FA] to-[#A78BFA] flex-shrink-0 shadow-[0_0_12px_rgba(96,165,250,0.3)]">
          <span className="text-xs font-black text-white">S</span>
        </div>
        {expanded && (
          <span 
            className="text-sm font-extrabold whitespace-nowrap tracking-tight"
            style={{ 
              color: 'var(--saga-logo-text)',
              opacity: expanded ? 1 : 0,
              transition: 'opacity 0.2s ease 0.1s',
            }}
          >
            SAGA OS
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mx-2 mb-2" style={{ backgroundColor: 'var(--saga-border)' }} />
      
      {/* Nav Items */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                'group relative flex w-full items-center gap-2.5 rounded-lg border-none cursor-pointer text-xs font-medium transition-all duration-150 overflow-hidden whitespace-nowrap',
                expanded ? 'px-3 py-2' : 'px-2 py-2 justify-center',
              )}
              style={{
                backgroundColor: isActive ? 'var(--saga-surface-active)' : 'transparent',
                color: isActive ? 'var(--saga-text)' : 'var(--saga-text-secondary)',
                fontWeight: isActive ? 700 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--saga-surface-hover)';
                  e.currentTarget.style.color = 'var(--saga-text-strong)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--saga-text-secondary)';
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-[20%] h-[60%] w-[2.5px] rounded-r bg-blue-400" />
              )}

              {/* Icon */}
              <item.icon className="h-4 w-4 flex-shrink-0" />

              {/* Label */}
              {expanded && (
                <span className="overflow-hidden text-ellipsis" style={{ opacity: 1, transition: 'opacity 0.15s ease 0.08s' }}>
                  {item.label}
                </span>
              )}

              {/* Keyboard shortcut */}
              {expanded && (
                <span 
                  className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-mono"
                  style={{ backgroundColor: 'var(--saga-kbd-bg)', color: 'var(--saga-text-ghost)', opacity: 1, transition: 'opacity 0.15s ease 0.12s' }}
                >
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center gap-2.5 rounded-lg cursor-pointer transition-all duration-150',
          expanded ? 'px-3 py-2' : 'px-2 py-2 justify-center',
        )}
        style={{ color: 'var(--saga-text-secondary)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--saga-surface-hover)';
          e.currentTarget.style.color = 'var(--saga-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--saga-text-secondary)';
        }}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4 flex-shrink-0" /> : <Moon className="h-4 w-4 flex-shrink-0" />}
        {expanded && (
          <span className="text-xs font-medium overflow-hidden text-ellipsis" style={{ opacity: 1, transition: 'opacity 0.15s ease 0.08s' }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </button>
      
      {/* Footer hint */}
      {expanded && (
        <div 
          className="mt-2 px-3 py-2.5 text-[9px] font-mono leading-relaxed"
          style={{ borderTop: '1px solid var(--saga-border)', color: 'var(--saga-text-ghost)', opacity: 1, transition: 'opacity 0.2s ease 0.15s' }}
        >
          Press <span style={{ color: 'var(--saga-text-muted)' }}>1-7</span> to navigate
          <br />
          <span style={{ color: 'var(--saga-text-muted)' }}>⌘K</span> for commands
        </div>
      )}
    </motion.div>
  );
}

// Dashboard View
function DashboardView() {
  const { agents, sessions, projects, mrr, mrrHistory, revenueStreak } = useSystemStore();
  
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const activeSessions = sessions.filter(s => s.agent !== null).length;
  
  const chartData = mrrHistory.map((value, i) => ({
    month: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i],
    value,
  }));
  
  return (
    <div className="space-y-6">
      {/* Next Action Card */}
      <GlassCard className="p-6" borderAccent="#FFB020">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20">
              <Target className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={t.text}>🎯 Deploy email sequence for AI Templates</h3>
              <p className="mt-1 text-sm" style={t.textSecondary}>
                This project grew 40% last week. An email to trial users could convert 3 pending signups.
              </p>
              <button className="mt-3 text-xs font-semibold text-orange-400 hover:text-orange-300">
                Why this? ↓
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-500/30">
              Not now
            </button>
            <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
              Do it →
            </button>
          </div>
        </div>
      </GlassCard>
      
      {/* KPI Grid */}
      <div className="grid grid-cols-6 gap-4">
        {[
          { label: 'Total Crew', value: agents.length, sub: `${activeAgents} active`, color: '#0052CC' },
          { label: 'Active Now', value: activeAgents, sub: `of ${agents.length} agents`, color: '#00875A' },
          { label: 'Session Slots', value: `${activeSessions}/8`, sub: `${8 - activeSessions} available`, color: '#FF991F' },
          { label: 'MRR', value: `$${mrr}`, sub: '+$50 this month', color: '#00875A' },
          { label: 'Revenue Streak', value: `${revenueStreak}d`, sub: '🔥 Keep it up!', color: '#E91E84' },
          { label: 'Projects', value: projects.length, sub: '1 in autopilot', color: '#6554C0' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4" hover borderAccent={stat.color}>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={t.textMuted}>
              {stat.label}
            </div>
            <div className="mt-1 text-2xl font-black" style={t.text}>{stat.value}</div>
            <div className="mt-1 text-[10px]" style={t.textFaint}>{stat.sub}</div>
          </GlassCard>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Sessions Monitor */}
        <div className="col-span-2">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold" style={t.text}>Session Monitor</h3>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Live</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {sessions.map((session) => {
                const agent = agents.find(a => a.name === session.agent);
                const priorityColors = {
                  REVENUE: '#00875A',
                  BUILD: '#0052CC',
                  MAINTAIN: '#FF991F',
                };
                
                return (
                  <div
                    key={session.slot}
                    className="rounded-xl border p-3 transition-all hover:scale-105"
                    style={{
                      borderColor: 'var(--saga-border)',
                      backgroundColor: session.agent ? 'var(--saga-surface)' : 'var(--saga-surface-dim)',
                      borderStyle: session.agent ? 'solid' : 'dashed',
                      ...(session.pri ? { borderTopWidth: '3px', borderTopColor: priorityColors[session.pri] } : {}),
                    }}
                  >
                    <div className="flex items-start justify-between text-[9px] font-bold uppercase tracking-wider" style={t.textFaint}>
                      <span>Slot {session.slot}</span>
                      {session.agent && agent && (
                        <span className="text-xs" style={{ color: agent.color }}>
                          {agent.avatar}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs font-bold" style={t.text}>
                      {session.agent || '— Available —'}
                    </div>
                    <div className="mt-1 text-[10px] leading-snug" style={t.textMuted}>
                      {session.task}
                    </div>
                    {session.pct > 0 && (
                      <div className="mt-2">
                        <div className="h-1 overflow-hidden rounded-full" style={t.progressBg}>
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${session.pct}%`,
                              backgroundColor: session.pri ? priorityColors[session.pri] : '#6B7280',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
        
        {/* Revenue Quick View */}
        <div>
          <GlassCard className="p-6">
            <h3 className="mb-4 text-sm font-bold" style={t.text}>Revenue Velocity</h3>
            <div className="mb-4">
              <div className="text-3xl font-black" style={t.text}>${mrr}</div>
              <div className="mt-1 text-xs text-emerald-400">↑ +17.2% this month</div>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height={96}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00875A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00875A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00875A"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 pt-4" style={{ borderTop: '1px solid var(--saga-border)' }}>
              {projects.filter(p => parseInt(p.revenue.replace(/\$/g, '')) > 0).map((project) => (
                <div key={project.name} className="flex items-center justify-between">
                  <span className="text-xs" style={t.textSecondary}>{project.name}</span>
                  <span className="text-xs font-bold" style={t.text}>{project.revenue}/mo</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Activity Feed */}
      <GlassCard className="p-6">
        <h3 className="mb-4 text-sm font-bold" style={t.text}>Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: '2m ago', msg: 'p2-frontend deployed component library', color: '#0052CC', agent: '🎨' },
            { time: '8m ago', msg: 'trend-observer found 3 market signals', color: '#6554C0', agent: '🔭' },
            { time: '15m ago', msg: 'p1-social posted to X (2.1K views)', color: '#00875A', agent: '📱' },
            { time: '1h ago', msg: 'p2-outreach sent 12 cold emails', color: '#FF991F', agent: '📧' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                style={{ backgroundColor: `${activity.color}20` }}
              >
                {activity.agent}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={t.textStrong}>{activity.msg}</p>
                <p className="mt-0.5 text-[10px] font-mono" style={t.textFaint}>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Vinama Status Board (from GitHub repo) ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
              <FolderKanban className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-black" style={t.text}>Vinama Status Board</h2>
              <p className="text-[10px] font-mono" style={t.textFaint}>Refreshed: 2026-02-26T05:19:02Z</p>
            </div>
          </div>
          <a
            href="https://github.com/vikas8520-coder/Saga"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-cyan-500/20"
            style={t.textMuted}
          >
            <ExternalLink className="h-3 w-3" /> GitHub
          </a>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
            {[
              { col: 'New_Intake', icon: '📥', color: '#60A5FA', items: [] as any[] },
              { col: 'Needs_Agent', icon: '🤖', color: '#A78BFA', items: [] as any[] },
              { col: 'Pillar_Review', icon: '🔍', color: '#F59E0B', items: [] as any[] },
              { col: 'In_Build', icon: '🔨', color: '#0052CC', items: [] as any[] },
              { col: 'In_Market', icon: '📣', color: '#00875A', items: [] as any[] },
              { col: 'Blocked', icon: '🚫', color: '#DE350B', items: [] as any[] },
              {
                col: 'Ready_For_Ship', icon: '📦', color: '#00B8D9', items: [
                  { id: 'REQ-20260226033917-001', agent: 'apollo', owner: 'apollo-lead', status: 'IN_PROGRESS' },
                  { id: 'REQ-20260226033938-002', agent: 'unassigned', owner: 'triage', status: 'IN_PROGRESS' },
                ],
              },
              { col: 'Awaiting_Proof', icon: '🧪', color: '#E91E84', items: [] as any[] },
              { col: 'Shipped', icon: '✅', color: '#00875A', items: [] as any[] },
            ].map(column => (
              <div key={column.col} className="w-[180px] flex-shrink-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{column.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={t.textSecondary}>
                      {column.col.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black"
                    style={{ backgroundColor: column.items.length > 0 ? `${column.color}20` : 'var(--saga-surface-dim)', color: column.items.length > 0 ? column.color : 'var(--saga-text-ghost)' }}
                  >
                    {column.items.length}
                  </span>
                </div>

                <div className="min-h-[120px] rounded-xl p-2 space-y-2" style={t.surfaceDim}>
                  {column.items.length === 0 ? (
                    <div className="flex h-[100px] items-center justify-center">
                      <Circle className="h-4 w-4" style={t.textGhost} />
                    </div>
                  ) : (
                    column.items.map((item: any) => (
                      <GlassCard key={item.id} className="p-3" borderAccent={column.color} hover>
                        <div className="text-[9px] font-mono font-bold truncate" style={{ color: column.color }}>
                          {item.id}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <div
                            className="h-5 w-5 rounded-md flex items-center justify-center text-[9px]"
                            style={{ backgroundColor: item.agent !== 'unassigned' ? '#60A5FA20' : '#DE350B20' }}
                          >
                            {item.agent !== 'unassigned' ? '🚀' : '❓'}
                          </div>
                          <span className="text-[10px] font-semibold truncate" style={t.text}>{item.agent}</span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[9px]" style={t.textFaint}>owner: {item.owner}</span>
                          <span
                            className="rounded px-1.5 py-0.5 text-[8px] font-bold uppercase"
                            style={{ backgroundColor: '#F59E0B20', color: '#F59E0B' }}
                          >
                            {item.status}
                          </span>
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Agent Hierarchy (from GitHub repo) ── */}
      <GlassCard className="p-6" borderAccent="#A78BFA">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
              <Network className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={t.text}>Vinama Agent Hierarchy</h3>
              <p className="text-[10px]" style={t.textFaint}>Factory → Pillar → Agent org structure</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="rounded-xl border-2 px-6 py-3 text-center"
            style={{ borderColor: '#A78BFA', backgroundColor: '#A78BFA15' }}
          >
            <div className="text-lg font-black" style={t.text}>SAGA OS</div>
            <div className="text-[10px]" style={t.textMuted}>Orchestration Layer</div>
          </div>

          <div className="h-6 w-px" style={{ backgroundColor: 'var(--saga-border-strong)' }} />

          <div className="grid grid-cols-4 gap-6 w-full">
            {[
              {
                name: 'Vida', icon: '🏗️', color: '#0052CC', role: 'Build Pillar',
                agents: ['p2-frontend', 'p2-api', 'p1-reviewer'],
                desc: 'Code, components, APIs',
              },
              {
                name: 'Nama', icon: '📣', color: '#00875A', role: 'Growth Pillar',
                agents: ['p2-outreach', 'p1-social', 'p2-seo', 'lead-gen'],
                desc: 'Marketing, outreach, SEO',
              },
              {
                name: 'Atlas', icon: '🌐', color: '#00B8D9', role: 'Infra Pillar',
                agents: ['deploy-bot', 'health-mon', 'db-manager'],
                desc: 'Deploy, monitoring, infra',
              },
              {
                name: 'Aegis', icon: '🛡️', color: '#DE350B', role: 'Ops Pillar',
                agents: ['compliance-bot', 'invoice-gen'],
                desc: 'Compliance, billing, legal',
              },
            ].map(pillar => (
              <div key={pillar.name} className="flex flex-col items-center">
                <div className="h-4 w-px" style={{ backgroundColor: 'var(--saga-border-strong)' }} />

                <GlassCard className="w-full p-4" borderAccent={pillar.color}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{pillar.icon}</span>
                    <div>
                      <div className="text-sm font-black" style={{ color: pillar.color }}>{pillar.name}</div>
                      <div className="text-[9px] font-bold uppercase tracking-wider" style={t.textFaint}>{pillar.role}</div>
                    </div>
                  </div>
                  <div className="text-[10px] mb-3" style={t.textMuted}>{pillar.desc}</div>

                  <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--saga-border)' }}>
                    {pillar.agents.map(agent => (
                      <div key={agent} className="flex items-center gap-2 rounded-md px-2 py-1.5" style={t.surfaceDim}>
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pillar.color }} />
                        <span className="text-[10px] font-mono font-semibold" style={t.text}>{agent}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ── Documentation Index (from GitHub repo) ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-black" style={t.text}>Documentation Index</h2>
            <p className="text-[10px]" style={t.textFaint}>Operational docs synced from Vinama repo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              name: 'agent_commands.md',
              path: 'docs/agent_commands.md',
              summary: 'Agent Command Reference — Vida & Nama',
              updated: '2026-02-25T20:20:40Z',
              icon: '⚡',
              color: '#FF991F',
            },
            {
              name: 'request_flow.md',
              path: 'docs/request_flow.md',
              summary: 'Intake → Routing → Approval Flow',
              updated: '2026-02-25T20:21:14Z',
              icon: '🔀',
              color: '#0052CC',
            },
            {
              name: 'status_board.md',
              path: 'docs/status_board.md',
              summary: 'Vinama Status Board (Kanban View)',
              updated: '2026-02-25T20:28:28Z',
              icon: '📋',
              color: '#00B8D9',
            },
            {
              name: 'visual_board.md',
              path: 'docs/visual_board.md',
              summary: 'Vinama Hierarchy Board',
              updated: '2026-02-25T20:25:05Z',
              icon: '🗺️',
              color: '#6554C0',
            },
          ].map(doc => (
            <GlassCard key={doc.name} className="p-5 cursor-pointer" borderAccent={doc.color} hover>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: `${doc.color}20` }}
                >
                  {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold" style={t.text}>{doc.summary}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded px-2 py-0.5 text-[9px] font-mono font-bold" style={{ backgroundColor: `${doc.color}20`, color: doc.color }}>
                      {doc.name}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[9px]" style={t.textGhost}>
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">{new Date(doc.updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="mx-1">·</span>
                    <span className="font-mono" style={t.textFaint}>{doc.path}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0" style={t.textGhost} />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// Crew Board View
function CrewView() {
  const { agents } = useSystemStore();
  
  const activeAgents = agents.filter(a => a.status === 'active');
  const idleAgents = agents.filter(a => a.status === 'idle');
  const archivedAgents = agents.filter(a => a.status === 'archived');
  
  const AgentCard = ({ agent }: { agent: any }) => (
    <GlassCard className="mb-3 p-4 cursor-pointer" hover>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-lg ring-2 ring-offset-2 ring-offset-black/20"
            style={{ 
              backgroundColor: `${agent.color}20`,
              ringColor: agent.color,
            }}
          >
            {agent.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold truncate" style={t.text}>{agent.name}</div>
            <div className="text-xs truncate" style={t.textMuted}>{agent.role}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end flex-shrink-0">
          <AgentStatusBadge status={agent.status} color={agent.color} />
          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${agent.color}20`, color: agent.color }}>
            {agent.model}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--saga-border)' }}>
        <div className="rounded px-2 py-1 text-[10px] font-semibold" style={{ backgroundColor: agent.type === 'core' ? '#FF991F20' : agent.type === 'brain' ? '#6554C020' : '#0052CC20', color: agent.type === 'core' ? '#FF991F' : agent.type === 'brain' ? '#6554C0' : '#0052CC' }}>
          {agent.type.toUpperCase()}
        </div>
        <div className="rounded px-2 py-1 text-[10px] font-semibold" style={{ backgroundColor: agent.mem === 'ISOLATED' ? '#DE350B20' : agent.mem === 'SHARED' ? '#00875A20' : '#FF991F20', color: agent.mem === 'ISOLATED' ? '#DE350B' : agent.mem === 'SHARED' ? '#00875A' : '#FF991F' }}>
          {agent.mem === 'ISOLATED' ? '🔒' : agent.mem === 'SHARED' ? '🌐' : '🔑'} {agent.mem}
        </div>
        <div className="ml-auto rounded px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: `${agent.color}20`, color: agent.color }}>
          {agent.project}
        </div>
      </div>
    </GlassCard>
  );

  const ColumnHeader = ({ dot, label, count }: { dot: string; label: string; count: number }) => (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn('h-2 w-2 rounded-full', dot)} />
        <span className="text-xs font-bold uppercase tracking-wider" style={t.textSecondary}>{label}</span>
      </div>
      <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ ...t.textFaint, ...t.surfaceDim }}>{count}</span>
    </div>
  );
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black" style={t.text}>Crew Board</h1>
        <button className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-400 hover:bg-blue-500/30">
          + Spawn New Agent
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        <div>
          <ColumnHeader dot="bg-emerald-400" label="Active" count={activeAgents.length} />
          <div className="rounded-xl p-3" style={t.surfaceDim}>
            {activeAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </div>
        
        <div>
          <ColumnHeader dot="bg-orange-400" label="Idle" count={idleAgents.length} />
          <div className="rounded-xl p-3" style={t.surfaceDim}>
            {idleAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </div>
        
        <div>
          <ColumnHeader dot="bg-gray-400" label="Archived" count={archivedAgents.length} />
          <div className="rounded-xl p-3" style={t.surfaceDim}>
            {archivedAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </div>
        
        {/* Factories Sidebar */}
        <div>
          <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={t.textSecondary}>🏭 Agent Factories</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Vida', icon: '🏗️', spawned: 8, color: '#0052CC', subs: 'frontend, api, reviewer' },
              { name: 'Nama', icon: '📣', spawned: 12, color: '#00875A', subs: 'email, social, leads, seo' },
              { name: 'Atlas', icon: '🌐', spawned: 6, color: '#00B8D9', subs: 'deploy, health, db' },
              { name: 'Aegis', icon: '🛡️', spawned: 5, color: '#DE350B', subs: 'compliance, invoice' },
            ].map(factory => (
              <GlassCard key={factory.name} className="p-4" borderAccent={factory.color} hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{factory.icon}</span>
                    <span className="text-sm font-bold" style={t.text}>{factory.name}</span>
                  </div>
                  <span className="text-sm font-black" style={{ color: factory.color }}>{factory.spawned}</span>
                </div>
                <div className="mt-2 text-[10px]" style={t.textFaint}>{factory.subs}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsView() {
  const { projects } = useSystemStore();
  
  const phases: { id: Phase; label: string; icon: string; color: string }[] = [
    { id: 'NEW', label: 'NEW', icon: '✨', color: '#94A3B8' },
    { id: 'SCOUT', label: 'SCOUT', icon: '🔭', color: '#FF991F' },
    { id: 'SPAWN', label: 'SPAWN', icon: '🏭', color: '#E91E84' },
    { id: 'BUILD', label: 'BUILD', icon: '🔨', color: '#0052CC' },
    { id: 'LAUNCH', label: 'LAUNCH', icon: '🚀', color: '#00B8D9' },
    { id: 'AUTOPILOT', label: 'AUTOPILOT', icon: '🤖', color: '#00875A' },
  ];
  
  const totalBots = projects.reduce((s, p) => s + p.bots, 0);
  const totalActive = projects.reduce((s, p) => s + p.active, 0);
  const totalRevenue = projects.reduce((s, p) => s + parseInt(p.revenue.replace(/\$/g, '')), 0);
  
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black" style={t.text}>Projects Pipeline</h1>
        </div>
      </div>
      
      {/* Phase Tabs — horizontal summary pills */}
      <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-1">
        {phases.map(phase => {
          const count = phase.id === 'NEW' ? 0 : projects.filter(p => p.phase === phase.id).length;
          return (
            <div
              key={phase.id}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-shrink-0 border"
              style={{
                borderColor: count > 0 ? `${phase.color}40` : 'var(--saga-border)',
                backgroundColor: count > 0 ? `${phase.color}10` : 'transparent',
              }}
            >
              <span className="text-sm">{phase.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: count > 0 ? phase.color : 'var(--saga-text-muted)' }}>
                {phase.label}
              </span>
              <span
                className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black"
                style={{
                  backgroundColor: count > 0 ? `${phase.color}30` : 'var(--saga-surface-dim)',
                  color: count > 0 ? phase.color : 'var(--saga-text-ghost)',
                }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Portfolio Overview Bar */}
      <div className="mb-6 flex items-center gap-6 rounded-xl border px-5 py-3" style={{ borderColor: 'var(--saga-border)', backgroundColor: 'var(--saga-surface-dim)' }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={t.textFaint}>Portfolio Overview</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🔥</span>
          <span className="text-xs font-bold text-orange-400">${totalRevenue}/mo total</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">🤖</span>
          <span className="text-xs font-bold" style={t.textSecondary}>{totalBots} bots total</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">{totalActive} active bots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📁</span>
          <span className="text-xs font-bold" style={t.textSecondary}>{projects.length} projects</span>
        </div>
      </div>
      
      {/* Kanban Columns */}
      <div className="grid grid-cols-6 gap-4">
        {phases.map(phase => {
          const phaseProjects = phase.id === 'NEW' ? [] : projects.filter(p => p.phase === phase.id);
          const isNew = phase.id === 'NEW';
          
          return (
            <div key={phase.id}>
              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{phase.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: phase.color }}>{phase.label}</span>
                </div>
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black"
                  style={{
                    backgroundColor: phaseProjects.length > 0 ? `${phase.color}20` : 'var(--saga-surface-dim)',
                    color: phaseProjects.length > 0 ? phase.color : 'var(--saga-text-ghost)',
                  }}
                >
                  {phaseProjects.length}
                </span>
              </div>
              
              {/* Column Body */}
              <div className="min-h-[400px] rounded-xl p-3" style={t.surfaceDim}>
                {isNew ? (
                  <div className="space-y-3">
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 text-xs font-semibold transition-colors hover:border-blue-500/50 hover:text-blue-400"
                      style={{ borderColor: 'var(--saga-border-strong)', color: 'var(--saga-text-muted)' }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Project
                    </button>
                    <div className="flex h-24 items-center justify-center text-center text-[10px]" style={t.textGhost}>
                      No new projects yet
                    </div>
                  </div>
                ) : phaseProjects.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
                    <span className="text-2xl opacity-30">{phase.icon}</span>
                    <span className="text-[10px]" style={t.textGhost}>No projects</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {phaseProjects.map(project => (
                      <GlassCard key={project.name} className="p-4 cursor-pointer" hover borderAccent={phase.color}>
                        <div className="text-sm font-bold" style={t.text}>{project.name}</div>
                        <div className="mt-1 text-xs leading-relaxed" style={t.textMuted}>{project.desc}</div>
                        
                        {/* Badges Row */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.revenue && project.revenue !== '$0' && (
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: '#00875A20', color: '#00875A' }}>
                              🔥 {project.revenue}/mo
                            </span>
                          )}
                          {project.bots > 0 && (
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: '#0052CC20', color: '#0052CC' }}>
                              🤖 {project.bots} bots
                            </span>
                          )}
                          {project.active > 0 && (
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: '#00875A20', color: '#00875A' }}>
                              ⚡ {project.active} active
                            </span>
                          )}
                          {project.signals !== undefined && project.signals > 0 && (
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: '#FF991F20', color: '#FF991F' }}>
                              📡 {project.signals} signals
                            </span>
                          )}
                          {project.score !== undefined && (
                            <span className="rounded px-1.5 py-0.5 text-[9px] font-bold" style={{ backgroundColor: '#6554C020', color: '#6554C0' }}>
                              ⭐ {project.score}%
                            </span>
                          )}
                        </div>
                        
                        {/* Progress */}
                        {project.pct !== undefined && (
                          <div className="mt-3">
                            <div className="mb-1 flex justify-between text-[9px]" style={t.textFaint}>
                              <span>Progress</span>
                              <span className="font-mono font-bold" style={{ color: phase.color }}>{project.pct}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full" style={t.progressBg}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${project.pct}%`, backgroundColor: phase.color }} />
                            </div>
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Build View — condensed pipeline + app monitoring
function BuildView() {
  const { projects } = useSystemStore();
  
  const phases: { id: Phase; label: string; icon: string; color: string }[] = [
    { id: 'SCOUT', label: 'SCOUT', icon: '🔭', color: '#FF991F' },
    { id: 'BUILD', label: 'BUILD', icon: '🔨', color: '#0052CC' },
    { id: 'LAUNCH', label: 'LAUNCH', icon: '🚀', color: '#00B8D9' },
    { id: 'AUTOPILOT', label: 'AUTOPILOT', icon: '🤖', color: '#00875A' },
  ];
  
  // Tech stacks per project
  const techStacks: Record<string, string[]> = {
    'SaaS Tracker': ['Next.js', 'Supabase', 'Stripe', 'Vercel'],
    'AI Templates': ['React', 'FastAPI', 'Stripe', 'CF Pages'],
    'Telegram Remote Agent': ['Python', 'Telegram API', 'Redis'],
    'Micro-SaaS': [],
  };
  
  // Build milestones per project
  const milestones: Record<string, { name: string; status: 'done' | 'active' | 'todo' }[]> = {
    'AI Templates': [
      { name: 'Template Engine', status: 'done' },
      { name: 'Marketplace UI', status: 'active' },
      { name: 'Stripe + Launch', status: 'todo' },
    ],
    'Telegram Remote Agent': [
      { name: 'Bot Framework', status: 'done' },
      { name: 'Command Parser', status: 'active' },
      { name: 'Agent Bridge', status: 'todo' },
    ],
    'Micro-SaaS': [
      { name: 'Market Research', status: 'active' },
      { name: 'Validate Niche', status: 'todo' },
    ],
    'SaaS Tracker': [
      { name: 'Dependencies', status: 'done' },
      { name: 'Monitoring', status: 'done' },
      { name: 'GA Prediction', status: 'active' },
    ],
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black" style={t.text}>Build</h1>
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: '#DE350B20' }}>
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">Gateway Offline</span>
          </div>
        </div>
      </div>
      
      {/* Condensed Pipeline Overview */}
      <GlassCard className="mb-6 p-5">
        <div className="grid grid-cols-4 gap-4">
          {phases.map(phase => {
            const phaseProjects = projects.filter(p => p.phase === phase.id);
            
            return (
              <div key={phase.id}>
                {/* Phase column header */}
                <div className="mb-3 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: phase.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: phase.color }}>{phase.label}</span>
                  <span className="text-[9px] font-bold" style={t.textGhost}>{phaseProjects.length}</span>
                </div>
                
                {/* Project cards in column */}
                {phaseProjects.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-[10px]" style={{ borderColor: 'var(--saga-border)', color: 'var(--saga-text-ghost)' }}>
                    No apps
                  </div>
                ) : (
                  <div className="space-y-3">
                    {phaseProjects.map(project => (
                      <div
                        key={project.name}
                        className="rounded-xl border p-4"
                        style={{ borderColor: 'var(--saga-border)', backgroundColor: 'var(--saga-surface)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-sm font-bold" style={t.text}>{project.name}</div>
                          {project.revenue !== '$0' && (
                            <span className="text-xs font-bold text-emerald-400">{project.revenue}/mo</span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[10px]" style={t.textMuted}>{project.desc}</div>
                        
                        {/* Tech Stack Tags */}
                        {techStacks[project.name] && techStacks[project.name].length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {techStacks[project.name].map(tech => (
                              <span key={tech} className="rounded px-1.5 py-0.5 text-[8px] font-bold" style={{ backgroundColor: `${phase.color}15`, color: phase.color }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Milestones */}
                        {milestones[project.name] && (
                          <div className="mt-3 space-y-1.5">
                            {project.pct !== undefined && (
                              <div className="flex items-center gap-2 text-[9px]" style={t.textFaint}>
                                <span>●</span>
                                <span>{project.pct}/100</span>
                              </div>
                            )}
                            {milestones[project.name].map(ms => (
                              <div key={ms.name} className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-sm"
                                  style={{
                                    backgroundColor: ms.status === 'done' ? '#00875A' : ms.status === 'active' ? phase.color : 'var(--saga-surface-dim)',
                                  }}
                                />
                                <span className="text-[10px]" style={ms.status === 'done' ? t.textMuted : t.text}>{ms.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>
      
      {/* App Monitoring Section */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Monitor className="h-4 w-4" style={t.textMuted} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={t.textMuted}>App Monitoring</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Live App Cards */}
          {projects.filter(p => p.phase === 'AUTOPILOT' || p.phase === 'BUILD').map(project => {
            const revenue = parseInt(project.revenue.replace(/\$/g, ''));
            const isLive = project.phase === 'AUTOPILOT';
            
            return (
              <div
                key={project.name}
                className="rounded-xl border p-5"
                style={{ borderColor: 'var(--saga-border)', backgroundColor: 'var(--saga-surface)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={t.text}>{project.name}</span>
                  <div className={cn('h-2 w-2 rounded-full', isLive ? 'bg-emerald-400' : 'bg-amber-400')} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider" style={t.textFaint}>Revenue</div>
                    <div className="mt-1 text-lg font-black" style={{ color: revenue > 0 ? '#00875A' : 'var(--saga-text-muted)' }}>
                      {revenue > 0 ? `$${revenue}` : '$0'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider" style={t.textFaint}>Users</div>
                    <div className="mt-1 text-lg font-black" style={{ color: '#0052CC' }}>
                      {isLive ? '23' : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider" style={t.textFaint}>Status</div>
                    <div className="mt-1 text-xs font-bold" style={{ color: isLive ? '#00875A' : '#FF991F' }}>
                      {isLive ? '99.8%' : 'building'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider" style={t.textFaint}>Agents</div>
                    <div className="mt-1 text-xs font-bold" style={{ color: '#00875A' }}>
                      {project.active} active
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Add New App Placeholder */}
          <button
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors hover:border-blue-500/40 hover:text-blue-400"
            style={{ borderColor: 'var(--saga-border-strong)', color: 'var(--saga-text-ghost)' }}
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs font-semibold">New Application</span>
            <span className="text-[9px]">connect via Token</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function SessionsView() {
  const { sessions, agents } = useSystemStore();
  
  const priorityConfig = {
    REVENUE: { color: '#00875A', label: 'P1 Revenue' },
    BUILD: { color: '#0052CC', label: 'P2 Build' },
    MAINTAIN: { color: '#FF991F', label: 'P3 Maintain' },
  };
  
  const activeSessions = sessions.filter(s => s.agent);
  const openSlots = sessions.filter(s => !s.agent);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={t.text}>Session Monitor</h1>
        <p className="mt-1 text-sm" style={t.textMuted}>8 concurrent execution slots • Real-time monitoring</p>
      </div>
      
      {/* Priority Stats */}
      <div className="mb-6 flex items-center gap-4">
        {Object.entries(priorityConfig).map(([key, config]) => {
          const count = sessions.filter(s => s.pri === key).length;
          return (
            <div key={key} className="flex items-center gap-2 rounded-lg px-4 py-2" style={{ backgroundColor: `${config.color}20` }}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
                {config.label}
              </span>
              <span className="text-lg font-black" style={{ color: config.color }}>{count}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2" style={t.surfaceDim}>
          <span className="text-xs font-bold uppercase tracking-wider" style={t.textFaint}>{openSlots.length} Open Slots</span>
        </div>
      </div>
      
      {/* Session Grid */}
      <div className="grid grid-cols-4 gap-4">
        {sessions.map(session => {
          const agent = agents.find(a => a.name === session.agent);
          const config = session.pri ? priorityConfig[session.pri] : null;
          
          return (
            <GlassCard 
              key={session.slot} 
              className={cn('p-5 cursor-pointer', session.agent ? 'hover:scale-105 transition-transform' : 'opacity-60')}
              borderAccent={config?.color}
              hover={!!session.agent}
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider" style={t.textFaint}>Slot {session.slot}</span>
                {agent && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-lg ring-2" style={{ backgroundColor: `${agent.color}20`, ringColor: agent.color }}>
                    {agent.avatar}
                  </div>
                )}
              </div>
              
              {/* Agent Info */}
              <div className="mb-2 text-sm font-bold" style={t.text}>
                {session.agent || '— Available —'}
              </div>
              <div className="mb-3 text-xs leading-relaxed" style={t.textMuted}>
                {session.task}
              </div>
              
              {/* Badges */}
              {session.agent && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {session.project && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: agent ? `${agent.color}20` : 'var(--saga-surface-dim)', color: agent?.color || 'var(--saga-text)' }}>
                      {session.project}
                    </span>
                  )}
                  {session.mem && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: session.mem === 'ISOLATED' ? '#DE350B20' : session.mem === 'SHARED' ? '#00875A20' : '#FF991F20', color: session.mem === 'ISOLATED' ? '#DE350B' : session.mem === 'SHARED' ? '#00875A' : '#FF991F' }}>
                      {session.mem === 'ISOLATED' ? '🔒' : session.mem === 'SHARED' ? '🌐' : '🔑'}
                    </span>
                  )}
                </div>
              )}
              
              {/* Progress */}
              {session.pct > 0 && (
                <div>
                  <div className="mb-2 flex justify-between text-[10px]" style={t.textFaint}>
                    <span>Progress</span>
                    <span className="font-mono font-bold">{session.pct}%</span>
                  </div>
                  <div className="mb-2 h-1.5 overflow-hidden rounded-full" style={t.progressBg}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${session.pct}%`, backgroundColor: config?.color || '#6B7280' }} />
                  </div>
                  {session.tokenCount && (
                    <div className="text-[9px] font-mono" style={t.textGhost}>{session.tokenCount.toLocaleString()} tokens</div>
                  )}
                </div>
              )}
              
              {/* Priority Badge */}
              {session.pri && config && (
                <div className="mt-3 rounded-lg px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                  {session.pri}
                </div>
              )}
              
              {/* Empty State CTA */}
              {!session.agent && (
                <button
                  className="mt-2 w-full rounded-lg border border-dashed py-2 text-xs font-semibold hover:border-blue-500/50 hover:text-blue-400"
                  style={{ borderColor: 'var(--saga-border-strong)', color: 'var(--saga-text-faint)' }}
                >
                  + Assign Agent
                </button>
              )}
            </GlassCard>
          );
        })}
      </div>
      
      {/* Queue */}
      <div className="mt-6">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-bold" style={t.text}>Queue — Waiting for Slot</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'p2-email-bot', pri: 'REVENUE', wait: '2m', color: '#00875A' },
              { name: 'competitor-stalker', pri: 'MAINTAIN', wait: '8m', color: '#FF991F' },
              { name: 'p1-seo', pri: 'MAINTAIN', wait: '15m', color: '#FF991F' },
              { name: 'p2-content', pri: 'BUILD', wait: '22m', color: '#0052CC' },
            ].map(item => (
              <div key={item.name} className="rounded-xl border p-4" style={{ borderColor: 'var(--saga-border)', backgroundColor: 'var(--saga-surface-dim)' }}>
                <div className="text-xs font-bold" style={t.text}>{item.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    {item.pri}
                  </span>
                  <span className="text-[10px] font-mono" style={t.textFaint}>⏱ {item.wait}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function RevenueView() {
  const { mrr, mrrHistory, projects, revenueStreak } = useSystemStore();
  
  const chartData = mrrHistory.map((value, i) => ({
    month: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i],
    value,
  }));
  
  const growth = ((mrrHistory[mrrHistory.length - 1] - mrrHistory[mrrHistory.length - 2]) / mrrHistory[mrrHistory.length - 2] * 100).toFixed(1);
  const totalRevenue = 1005;
  const subscribers = 23;
  const churn = 2.1;
  const projectedMRR = Math.round(mrr * (1 + parseFloat(growth) / 100));
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={t.text}>Revenue Dashboard</h1>
        <p className="mt-1 text-sm" style={t.textMuted}>Track your recurring revenue and growth metrics</p>
      </div>
      
      {/* Top KPIs */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: 'MRR', value: `$${mrr}`, delta: `+$${mrrHistory[mrrHistory.length - 1] - mrrHistory[mrrHistory.length - 2]}`, color: '#00875A' },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, delta: 'all time', color: '#0052CC' },
          { label: 'Subscribers', value: subscribers, delta: '+4 this month', color: '#6554C0' },
          { label: 'Churn Rate', value: `${churn}%`, delta: 'healthy', color: '#00B8D9' },
        ].map(stat => (
          <GlassCard key={stat.label} className="p-5" borderAccent={stat.color} hover>
            <div className="text-xs font-semibold uppercase tracking-wider" style={t.textMuted}>{stat.label}</div>
            <div className="mt-2 text-3xl font-black" style={t.text}>{stat.value}</div>
            <div className="mt-1 text-xs font-semibold" style={{ color: stat.color }}>{stat.delta}</div>
          </GlassCard>
        ))}
      </div>
      
      {/* Revenue Velocity */}
      <div className="mb-6 grid grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="col-span-2">
          <GlassCard className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold" style={t.text}>Monthly Revenue Growth</h3>
                <p className="mt-1 text-xs" style={t.textFaint}>6-month trend with projection</p>
              </div>
              <div className="text-right">
                <div className="text-xs" style={t.textFaint}>Growth Rate</div>
                <div className="text-xl font-black text-emerald-400">↑ {growth}%</div>
              </div>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={256}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00875A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00875A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--saga-chart-axis)" style={{ fontSize: 11 }} />
                  <YAxis stroke="var(--saga-chart-axis)" style={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--saga-tooltip-bg)', border: '1px solid var(--saga-tooltip-border)', borderRadius: 8 }}
                    labelStyle={{ color: 'var(--saga-text)' }}
                    itemStyle={{ color: 'var(--saga-text-secondary)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00875A" strokeWidth={3} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={t.textMuted}>
              <span>Projected next month:</span>
              <span className="font-bold text-emerald-400">${projectedMRR}</span>
            </div>
          </GlassCard>
        </div>
        
        {/* Streak & Milestones */}
        <div className="space-y-6">
          <GlassCard className="p-6" borderAccent="#E91E84">
            <div className="text-xs font-semibold uppercase tracking-wider" style={t.textMuted}>Revenue Streak</div>
            <div className="mt-2 text-4xl font-black" style={t.text}>{revenueStreak}</div>
            <div className="mt-1 text-xs" style={t.textMuted}>days in a row</div>
            <div className="mt-4 text-2xl">🔥</div>
            <div className="mt-2 text-xs text-pink-400">Keep the momentum going!</div>
          </GlassCard>
          
          <GlassCard className="p-6" borderAccent="#6554C0">
            <div className="text-xs font-semibold uppercase tracking-wider" style={t.textMuted}>Current Stage</div>
            <div className="mt-2 text-lg font-black" style={t.text}>Solo Starter</div>
            <div className="mt-1 text-xs" style={t.textMuted}>$0 - $500 MRR</div>
            <div className="mt-4">
              <div className="mb-2 text-[10px]" style={t.textFaint}>Next: Side Hustler ($500)</div>
              <div className="h-2 overflow-hidden rounded-full" style={t.progressBg}>
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${(mrr / 500) * 100}%` }} />
              </div>
              <div className="mt-1 text-right text-[10px] font-bold text-purple-400">{Math.round((mrr / 500) * 100)}%</div>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Revenue by Project & Recent Payments */}
      <div className="grid grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-bold" style={t.text}>Revenue by Project</h3>
          <div className="space-y-4">
            {projects.map(project => {
              const revenue = parseInt(project.revenue.replace(/\$/g, ''));
              const percentage = mrr > 0 ? (revenue / mrr) * 100 : 0;
              
              return (
                <div key={project.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold" style={t.text}>{project.name}</span>
                    <span className="text-sm font-bold" style={{ color: project.color }}>{project.revenue}/mo</span>
                  </div>
                  {revenue > 0 && (
                    <div className="h-2 overflow-hidden rounded-full" style={t.progressBg}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: project.color }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-bold" style={t.text}>Recent Payments</h3>
          <div className="space-y-3">
            {[
              { customer: 'alex@startup.io', amount: 49, time: '2h ago', type: 'Subscription' },
              { customer: 'team@corp.com', amount: 99, time: '5h ago', type: 'Subscription' },
              { customer: 'dev@indie.co', amount: 29, time: '1d ago', type: 'One-time' },
              { customer: 'sarah@agency.io', amount: 49, time: '1d ago', type: 'Subscription' },
              { customer: 'mike@saas.com', amount: 99, time: '2d ago', type: 'Subscription' },
            ].map((payment, i) => (
              <div key={i} className="flex items-center justify-between pb-3 last:border-0" style={{ borderBottom: '1px solid var(--saga-border)' }}>
                <div>
                  <div className="text-xs font-semibold" style={t.text}>{payment.customer}</div>
                  <div className="mt-0.5 text-[10px]" style={t.textFaint}>{payment.type} · {payment.time}</div>
                </div>
                <div className="text-sm font-black text-emerald-400">+${payment.amount}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function MemoryView() {
  const { agents } = useSystemStore();
  
  const pools = [
    { id: 'all-projects', agents: 5, size: '12.4 MB', color: '#FF991F' },
    { id: 'market-intel', agents: 6, size: '8.1 MB', color: '#0052CC' },
    { id: 'code-patterns', agents: 6, size: '23.7 MB', color: '#6554C0' },
    { id: 'campaign-data', agents: 3, size: '4.2 MB', color: '#00875A' },
    { id: 'revenue-data', agents: 3, size: '1.8 MB', color: '#E91E84' },
    { id: 'seo-learnings', agents: 3, size: '6.5 MB', color: '#00B8D9' },
    { id: 'design-system', agents: 3, size: '15.3 MB', color: '#6554C0' },
    { id: 'compliance-rules', agents: 2, size: '0.9 MB', color: '#DE350B' },
    { id: 'infra-state', agents: 3, size: '2.1 MB', color: '#00B8D9' },
    { id: 'agent-performance', agents: 2, size: '3.4 MB', color: '#FF991F' },
  ];
  
  const memoryModes = [
    { mode: 'ISOLATED', icon: '🔒', count: agents.filter(a => a.mem === 'ISOLATED').length, desc: 'Private only. No cross-access.', color: '#DE350B' },
    { mode: 'SHARED', icon: '🌐', count: agents.filter(a => a.mem === 'SHARED').length, desc: 'Reads/writes shared pools.', color: '#00875A' },
    { mode: 'SELECTIVE', icon: '🔑', count: agents.filter(a => a.mem === 'SELECTIVE').length, desc: 'Private + opt-in pool access.', color: '#FF991F' },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={t.text}>Memory Pools</h1>
        <p className="mt-1 text-sm" style={t.textMuted}>Shared knowledge storage across your agent crew</p>
      </div>
      
      {/* Memory Mode Overview */}
      <div className="mb-6 grid grid-cols-3 gap-6">
        {memoryModes.map(mode => (
          <GlassCard key={mode.mode} className="p-6" borderAccent={mode.color} hover>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{mode.icon}</span>
              <span className="text-3xl font-black" style={{ color: mode.color }}>{mode.count}</span>
            </div>
            <div className="mt-3 text-base font-bold" style={t.text}>{mode.mode}</div>
            <div className="mt-1 text-xs leading-relaxed" style={t.textMuted}>{mode.desc}</div>
          </GlassCard>
        ))}
      </div>
      
      {/* Memory Pools Grid */}
      <div className="mb-6">
        <h3 className="mb-4 text-sm font-bold" style={t.text}>Shared Memory Pools</h3>
        <div className="grid grid-cols-2 gap-4">
          {pools.map(pool => (
            <GlassCard key={pool.id} className="p-5 cursor-pointer" borderAccent={pool.color} hover>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold font-mono" style={t.text}>{pool.id}</div>
                  <div className="mt-2 flex items-center gap-4 text-xs" style={t.textMuted}>
                    <span>👥 {pool.agents} agents</span>
                    <span>💾 {pool.size}</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black" style={{ backgroundColor: `${pool.color}20`, color: pool.color }}>
                  {pool.agents}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
      
      {/* Uniqueness Callout */}
      <GlassCard className="p-6" borderAccent="#6554C0">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🎭</div>
          <div>
            <h3 className="text-sm font-bold text-purple-400">Uniqueness ≠ Memory Mode</h3>
            <p className="mt-2 text-sm leading-relaxed" style={t.textSecondary}>
              Two agents with the same SKILL.md (email-seq-gen) produce different outputs because uniqueness comes from{' '}
              <strong style={t.text}>SOUL.md</strong> (personality),{' '}
              <strong style={t.text}>IDENTITY.md</strong> (immutable binding),{' '}
              <strong style={t.text}>Project Context</strong> (data scope), and{' '}
              <strong style={t.text}>Model</strong> (reasoning depth).
            </p>
            <p className="mt-2 text-xs" style={t.textMuted}>
              Memory controls <em>what data they see</em>. Identity controls <em>who they are</em>.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// Main App
export default function App() {
  const { currentView, currentPhase, theme, projects } = useSystemStore();
  
  // Initialize dark class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Derive the dominant phase from whichever project has the most active agents.
  // This makes the ambient background glow reflect what the system is actually doing.
  // Falls back to the manually-set currentPhase if no projects have active agents.
  const dominantPhase = useMemo(() => {
    if (projects.length === 0) return currentPhase;
    const sorted = [...projects].sort((a, b) => b.active - a.active);
    // Only use the project's phase if it actually has active agents
    if (sorted[0].active > 0) return sorted[0].phase;
    return currentPhase;
  }, [projects, currentPhase]);

  const gradient = PHASE_GRADIENTS[dominantPhase];
  const gradientOpacityMultiplier = theme === 'dark' ? 1 : 0.12;
  
  const views = {
    dash: DashboardView,
    crew: CrewView,
    projects: ProjectsView,
    build: BuildView,
    sessions: SessionsView,
    revenue: RevenueView,
    memory: MemoryView,
  };
  
  const ViewComponent = views[currentView as keyof typeof views] || DashboardView;
  
  return (
    <div className="relative h-screen w-full overflow-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--saga-bg)' }}>
      {/* Ambient Background Gradients */}
      <div className="pointer-events-none fixed inset-0">
        {gradient.colors.map((colorTemplate, i) => (
          <motion.div
            key={`${dominantPhase}-${i}`}
            className="absolute h-[600px] w-[600px] rounded-full blur-[80px]"
            style={{
              background: `radial-gradient(circle, ${getGradientColor(colorTemplate, gradient.opacities[i], gradientOpacityMultiplier)} 0%, transparent 70%)`,
              left: gradient.positions[i].split(' ')[0],
              top: gradient.positions[i].split(' ')[1],
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      {/* Main Layout */}
      <div className="relative z-10 flex h-full">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ViewComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      <CommandPalette />
      
      {/* Keyboard Shortcut Hint */}
      <div
        className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs backdrop-blur-sm"
        style={{ borderColor: 'var(--saga-border)', backgroundColor: 'var(--saga-sidebar-bg)', color: 'var(--saga-text-faint)' }}
      >
        <kbd className="rounded px-1.5 py-0.5 font-mono" style={t.kbdBg}>⌘</kbd>
        <span>+</span>
        <kbd className="rounded px-1.5 py-0.5 font-mono" style={t.kbdBg}>K</kbd>
        <span className="ml-1">for commands</span>
      </div>
    </div>
  );
}

// Helper function
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}