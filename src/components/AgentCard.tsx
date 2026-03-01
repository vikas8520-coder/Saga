interface AgentCardProps {
  children?: React.ReactNode;
}

export function AgentCard({ children }: AgentCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {children}
    </div>
  );
}
