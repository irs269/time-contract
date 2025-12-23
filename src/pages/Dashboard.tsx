import { useNavigate } from 'react-router-dom';
import { Timer, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/PremiumCard';
import { ProgressRing } from '@/components/ProgressRing';
import { useAppState } from '@/hooks/useAppState';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, getFormattedTime } = useAppState();
  const { hours, minutes } = getFormattedTime();

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold silver-text mb-2">
          Je vends mon temps
        </h1>
        <p className="text-muted-foreground text-sm">
          Transforme chaque minute en valeur
        </p>
      </header>

      {/* Main Time Counter Card */}
      <PremiumCard className="mb-6 animate-slide-up" glow>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-silver/10">
            <Timer className="w-5 h-5 text-silver" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Temps vendu à ta discipline
          </span>
        </div>
        
        <div className="text-center py-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-semibold text-counter silver-text">
              {hours}
            </span>
            <span className="text-2xl text-muted-foreground">h</span>
            <span className="text-6xl font-semibold text-counter silver-text">
              {minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-2xl text-muted-foreground">min</span>
          </div>
        </div>

        {state.currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/50">
            <Flame className="w-4 h-4 text-warning" />
            <span className="text-sm text-muted-foreground">
              {state.currentStreak} jour{state.currentStreak > 1 ? 's' : ''} consécutif{state.currentStreak > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </PremiumCard>

      {/* Discipline Score Card */}
      <PremiumCard className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-silver/10">
            <Trophy className="w-5 h-5 text-silver" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Niveau de discipline
          </span>
        </div>

        <div className="flex justify-center">
          <ProgressRing progress={state.disciplineScore} size={180} strokeWidth={10}>
            <div className="text-center">
              <span className="text-5xl font-semibold text-counter silver-text">
                {state.disciplineScore}
              </span>
              <span className="block text-sm text-muted-foreground mt-1">
                / 100
              </span>
            </div>
          </ProgressRing>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-6">
          {state.disciplineScore >= 80 && 'Maîtrise exemplaire.'}
          {state.disciplineScore >= 60 && state.disciplineScore < 80 && 'Progression constante.'}
          {state.disciplineScore >= 40 && state.disciplineScore < 60 && 'Continue tes efforts.'}
          {state.disciplineScore < 40 && 'Chaque session compte.'}
        </p>
      </PremiumCard>

      {/* CTA Button */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Button
          variant="premium"
          size="xl"
          className="w-full animate-border-glow"
          onClick={() => navigate('/create')}
        >
          <Timer className="w-5 h-5" />
          Vendre mon temps
        </Button>
      </div>
    </div>
  );
}
