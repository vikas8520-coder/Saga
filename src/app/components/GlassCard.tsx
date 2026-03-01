import { ReactNode } from 'react';
import { cn } from './ui/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  borderAccent?: string;
}

export function GlassCard({ children, className, hover = false, borderAccent }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-xl',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
        className
      )}
      style={{
        backgroundColor: 'var(--saga-surface)',
        borderColor: 'var(--saga-border)',
        boxShadow: `0 1px 0 var(--saga-inset-shadow) inset`,
        ...(hover ? { ['--tw-hover-bg' as string]: 'var(--saga-surface-hover)' } : {}),
        ...(borderAccent ? {
          borderLeftWidth: '3px',
          borderLeftColor: borderAccent,
        } : {}),
      }}
      onMouseEnter={hover ? (e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--saga-surface-hover)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--saga-surface)';
      } : undefined}
    >
      {children}
    </div>
  );
}
