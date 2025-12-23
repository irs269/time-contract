import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/PremiumCard';
import type { Task } from '@/types/app';

interface LocationState {
  task: Task;
  actualDuration: number;
  status: 'completed' | 'abandoned';
}

export default function SessionComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  if (!state) {
    navigate('/');
    return null;
  }

  const { task, actualDuration, status } = state;
  const isCompleted = status === 'completed';

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}min`;
    }
    return `${mins}min ${secs}s`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Status Icon */}
      <div className={`mb-8 animate-scale-in ${isCompleted ? 'glow-silver' : ''}`}>
        {isCompleted ? (
          <div className="p-6 rounded-full bg-success/10 border border-success/30">
            <CheckCircle className="w-16 h-16 text-success" strokeWidth={1.5} />
          </div>
        ) : (
          <div className="p-6 rounded-full bg-destructive/10 border border-destructive/30">
            <XCircle className="w-16 h-16 text-destructive" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Message */}
      <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h1 className="text-2xl font-semibold silver-text mb-3">
          {isCompleted ? 'Temps respecté.' : 'Session interrompue.'}
        </h1>
        <p className="text-muted-foreground">
          {isCompleted
            ? 'Discipline renforcée.'
            : 'La constance se construit pas à pas.'}
        </p>
      </div>

      {/* Summary Card */}
      <PremiumCard className="w-full max-w-sm mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="space-y-4">
          {/* Task Name */}
          <div className="pb-4 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Tâche</span>
            <p className="text-silver-light font-medium mt-1">{task.name}</p>
          </div>

          {/* Time Sold */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Temps vendu</span>
            </div>
            <span className="text-silver-light font-semibold">
              {formatDuration(actualDuration)}
            </span>
          </div>

          {/* Score Impact */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className="text-sm text-muted-foreground">Score</span>
            </div>
            <span className={`font-semibold ${isCompleted ? 'text-success' : 'text-destructive'}`}>
              {isCompleted ? '+5' : '-10'}
            </span>
          </div>
        </div>
      </PremiumCard>

      {/* Action Button */}
      <div className="w-full max-w-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Button
          variant={isCompleted ? 'premium' : 'secondary'}
          size="xl"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Retour au tableau de discipline
        </Button>
      </div>
    </div>
  );
}
