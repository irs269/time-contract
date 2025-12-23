import { cn } from '@/lib/utils';
import type { ReactNode, CSSProperties } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  style?: CSSProperties;
}

export function PremiumCard({ children, className, glow = false, style }: PremiumCardProps) {
  return (
    <div
      className={cn(
        'premium-card p-6',
        glow && 'glow-silver',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
