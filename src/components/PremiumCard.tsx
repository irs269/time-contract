import { cn } from '@/lib/utils';
import type { ReactNode, CSSProperties } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  frost?: boolean;
  style?: CSSProperties;
}

export function PremiumCard({ children, className, glow = false, frost = false, style }: PremiumCardProps) {
  return (
    <div
      className={cn(
        'premium-card p-6 relative overflow-hidden',
        glow && 'glow-silver',
        frost && 'frost-border',
        className
      )}
      style={style}
    >
      {frost && (
        <>
          <div className="frost-shimmer" />
          <div className="frost-particles" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
