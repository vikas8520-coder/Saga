interface StatusBadgeProps {
  children?: React.ReactNode;
}

export function StatusBadge({ children }: StatusBadgeProps) {
  return (
    <div className="flex flex-col gap-4">
      {children}
    </div>
  );
}
