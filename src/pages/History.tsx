import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { PremiumCard } from '@/components/PremiumCard';
import { useAppState } from '@/hooks/useAppState';
import { cn } from '@/lib/utils';

type Period = 'day' | 'week' | 'month';

const periodLabels: Record<Period, string> = {
  day: 'Aujourd\'hui',
  week: 'Cette semaine',
  month: 'Ce mois',
};

export default function History() {
  const [period, setPeriod] = useState<Period>('week');
  const { getSessionsByPeriod, getFormattedTime } = useAppState();
  const sessions = getSessionsByPeriod(period);
  const { hours, minutes } = getFormattedTime();

  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const totalTimeInPeriod = sessions
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + s.actualDuration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (sessionDate.getTime() === today.getTime()) {
      return `Aujourd'hui, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (sessionDate.getTime() === yesterday.getTime()) {
      return `Hier, ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="text-center mb-6 animate-fade-in">
        <h1 className="text-2xl font-semibold silver-text mb-2">
          Historique
        </h1>
        <p className="text-muted-foreground text-sm">
          Ton parcours de discipline
        </p>
      </header>

      {/* Period Filter */}
      <div className="flex gap-2 mb-6 animate-slide-up">
        {(Object.keys(periodLabels) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300',
              period === p
                ? 'bg-silver/20 text-silver-light border border-silver/40'
                : 'bg-secondary/50 text-muted-foreground border border-transparent hover:border-border'
            )}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <PremiumCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-silver" />
            <span className="text-xs text-muted-foreground">Temps vendu</span>
          </div>
          <span className="text-xl font-semibold silver-text">
            {formatDuration(totalTimeInPeriod)}
          </span>
        </PremiumCard>

        <PremiumCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-silver" />
            <span className="text-xs text-muted-foreground">Sessions</span>
          </div>
          <span className="text-xl font-semibold silver-text">
            {completedSessions.length}
            <span className="text-sm text-muted-foreground font-normal ml-1">
              / {sessions.length}
            </span>
          </span>
        </PremiumCard>
      </div>

      {/* Sessions List */}
      <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {sessions.length === 0 ? (
          <PremiumCard className="py-12 text-center">
            <p className="text-muted-foreground">
              Aucune session {periodLabels[period].toLowerCase()}
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Commence à vendre ton temps
            </p>
          </PremiumCard>
        ) : (
          sessions.map((session, index) => (
            <PremiumCard
              key={session.id}
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-silver-light font-medium">
                    {session.taskName}
                  </h3>
                  {session.objective && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                      {session.objective}
                    </p>
                  )}
                </div>
                <div className={cn(
                  'p-1.5 rounded-lg',
                  session.status === 'completed' ? 'bg-success/10' : 'bg-destructive/10'
                )}>
                  {session.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatDate(new Date(session.completedAt))}
                </span>
                <span className="text-silver font-medium">
                  {formatDuration(session.actualDuration)}
                </span>
              </div>
            </PremiumCard>
          ))
        )}
      </div>
    </div>
  );
}
