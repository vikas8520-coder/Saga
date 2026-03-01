import { useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useSystemStore } from '../stores/useSystemStore';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  TrendingUp,
  DollarSign,
  Brain,
  Zap,
  Target,
  Bot,
  Sun,
  Moon,
} from 'lucide-react';

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setCurrentView, theme, toggleTheme } = useSystemStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandOpen, setCommandOpen]);

  const views = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crew', label: 'Crew Board', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'sessions', label: 'Sessions', icon: TrendingUp },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'memory', label: 'Memory', icon: Brain },
  ];

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {views.map((view) => (
            <CommandItem
              key={view.id}
              onSelect={() => {
                setCurrentView(view.id);
                setCommandOpen(false);
              }}
            >
              <view.icon className="mr-2 h-4 w-4" />
              <span>{view.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => {
            toggleTheme();
            setCommandOpen(false);
          }}>
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </CommandItem>
          <CommandItem>
            <Bot className="mr-2 h-4 w-4" />
            <span>Spawn New Agent</span>
          </CommandItem>
          <CommandItem>
            <Target className="mr-2 h-4 w-4" />
            <span>Create New Project</span>
          </CommandItem>
          <CommandItem>
            <Zap className="mr-2 h-4 w-4" />
            <span>View Next Action</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}