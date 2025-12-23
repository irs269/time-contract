import { cn } from '@/lib/utils';
import { BADGES, TIER_COLORS, type Badge, type BadgeStats } from '@/data/badges';
import { Lock } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  showAnimation?: boolean;
}

function BadgeCard({ badge, unlocked, showAnimation = false }: BadgeCardProps) {
  const tierStyle = TIER_COLORS[badge.tier];
  const Icon = badge.icon;

  return (
    <div
      className={cn(
        'relative p-4 rounded-2xl border transition-all duration-500',
        unlocked
          ? `${tierStyle.bg} ${tierStyle.border} ${tierStyle.glow}`
          : 'bg-secondary/30 border-border/30',
        showAnimation && unlocked && 'animate-scale-in'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'p-2.5 rounded-xl',
            unlocked ? tierStyle.bg : 'bg-muted/50'
          )}
        >
          {unlocked ? (
            <Icon className={cn('w-5 h-5', tierStyle.text)} />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground/50" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-medium text-sm truncate',
              unlocked ? tierStyle.text : 'text-muted-foreground/60'
            )}
          >
            {badge.name}
          </h3>
          <p className="text-xs text-muted-foreground/70 truncate">
            {badge.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface BadgesGridProps {
  stats: BadgeStats;
  showAll?: boolean;
}

export function BadgesGrid({ stats, showAll = false }: BadgesGridProps) {
  const unlockedBadges = BADGES.filter((badge) => badge.requirement(stats));
  const lockedBadges = BADGES.filter((badge) => !badge.requirement(stats));

  const displayBadges = showAll
    ? [...unlockedBadges, ...lockedBadges]
    : unlockedBadges.slice(0, 6);

  if (displayBadges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          Aucun badge débloqué pour l'instant
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Continue à vendre ton temps
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {displayBadges.map((badge) => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          unlocked={badge.requirement(stats)}
        />
      ))}
    </div>
  );
}

export function BadgeCount({ stats }: { stats: BadgeStats }) {
  const unlockedCount = BADGES.filter((badge) => badge.requirement(stats)).length;
  const totalCount = BADGES.length;

  return (
    <span className="text-silver-light font-semibold">
      {unlockedCount}
      <span className="text-muted-foreground font-normal text-sm">
        {' '}/ {totalCount}
      </span>
    </span>
  );
}
