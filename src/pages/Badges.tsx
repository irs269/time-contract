import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronLeft } from 'lucide-react';
import { PremiumCard } from '@/components/PremiumCard';
import { BadgesGrid, BadgeCount } from '@/components/BadgesGrid';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import type { BadgeStats } from '@/data/badges';

export default function Badges() {
  const navigate = useNavigate();
  const { state } = useAppState();
  
  // Calculate longest session
  const longestSession = state.sessions.reduce((max, session) => {
    if (session.status === 'completed' && session.actualDuration > max) {
      return session.actualDuration;
    }
    return max;
  }, 0);

  const stats: BadgeStats = {
    totalTimeSold: state.totalTimeSold,
    sessionsCompleted: state.sessions.filter(s => s.status === 'completed').length,
    currentStreak: state.currentStreak,
    disciplineScore: state.disciplineScore,
    longestSession,
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-silver-light transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold silver-text">
            Badges
          </h1>
          <p className="text-muted-foreground text-sm">
            Tes récompenses de discipline
          </p>
        </div>
      </header>

      {/* Stats Summary */}
      <PremiumCard className="mb-6 animate-slide-up" frost>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-silver/10">
              <Award className="w-6 h-6 text-silver" />
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Badges débloqués</span>
              <div className="mt-0.5">
                <BadgeCount stats={stats} />
              </div>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* Badges Grid */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <BadgesGrid stats={stats} showAll />
      </div>
    </div>
  );
}
