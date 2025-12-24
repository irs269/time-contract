import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Timer, Trophy, Flame, Award, Crown, Clock, LogOut, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/PremiumCard';
import { ProgressRing } from '@/components/ProgressRing';
import { BadgeCount } from '@/components/BadgesGrid';
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { BadgeStats } from '@/data/badges';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, getFormattedTime } = useAppState();
  const { hours, minutes } = getFormattedTime();
  const { 
    user, 
    trialTimeRemaining, 
    hasPremiumAccess, 
    signOut, 
    refreshProfile 
  } = useAuth();

  // Check for payment success and verify with Stripe
  useEffect(() => {
    const checkPayment = async () => {
      if (searchParams.get('payment') === 'success') {
        toast.success('Paiement réussi ! Bienvenue dans l\'accès premium.');
        
        // Verify payment with backend
        try {
          await supabase.functions.invoke('verify-payment');
          await refreshProfile();
        } catch (error) {
          console.error('Error verifying payment:', error);
        }
      }
    };
    
    checkPayment();
  }, [searchParams, refreshProfile]);

  // Format trial time remaining
  const formatTrialTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate stats for badges
  const longestSession = state.sessions.reduce((max, session) => {
    if (session.status === 'completed' && session.actualDuration > max) {
      return session.actualDuration;
    }
    return max;
  }, 0);

  const badgeStats: BadgeStats = {
    totalTimeSold: state.totalTimeSold,
    sessionsCompleted: state.sessions.filter(s => s.status === 'completed').length,
    currentStreak: state.currentStreak,
    disciplineScore: state.disciplineScore,
    longestSession,
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold silver-text mb-1">
            Je vends mon temps
          </h1>
          <p className="text-muted-foreground text-sm">
            Transforme chaque minute en valeur
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Trial/Premium Status */}
      {!hasPremiumAccess ? (
        <PremiumCard className="mb-4 animate-slide-up" frost>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <span className="text-sm font-medium text-warning block">
                  Mode essai
                </span>
                <span className="text-xs text-muted-foreground">
                  Temps restant: {formatTrialTime(trialTimeRemaining)}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/payment')}
              className="text-xs"
            >
              <Crown className="w-4 h-4 mr-1" />
              Débloquer
            </Button>
          </div>
        </PremiumCard>
      ) : (
        <PremiumCard className="mb-4 animate-slide-up" frost>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <span className="text-sm font-medium text-success block">
                Accès Premium à vie
              </span>
              <span className="text-xs text-muted-foreground">
                Toutes les fonctionnalités débloquées
              </span>
            </div>
          </div>
        </PremiumCard>
      )}

      {/* Main Time Counter Card */}
      <PremiumCard className="mb-4 animate-slide-up" frost glow style={{ animationDelay: '0.05s' }}>
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

      {/* Score and Badges Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Discipline Score */}
        <PremiumCard className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-silver" />
            <span className="text-xs text-muted-foreground">Score</span>
          </div>
          <div className="flex justify-center">
            <ProgressRing progress={state.disciplineScore} size={100} strokeWidth={6}>
              <span className="text-2xl font-semibold silver-text">
                {state.disciplineScore}
              </span>
            </ProgressRing>
          </div>
        </PremiumCard>

        {/* Badges */}
        <button
          onClick={() => navigate('/badges')}
          className="text-left"
        >
          <PremiumCard className="h-full animate-slide-up hover:border-silver/30 transition-colors" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-silver" />
              <span className="text-xs text-muted-foreground">Badges</span>
            </div>
            <div className="flex flex-col items-center justify-center h-[100px]">
              <BadgeCount stats={badgeStats} />
              <span className="text-xs text-muted-foreground mt-2">débloqués</span>
            </div>
          </PremiumCard>
        </button>
      </div>

      {/* Premium Access Button - Only show if not premium */}
      {!hasPremiumAccess && (
        <button
          onClick={() => navigate('/payment')}
          className="w-full mb-4 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <PremiumCard className="hover:border-silver/40 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-silver/20 to-silver/5">
                  <Crown className="w-5 h-5 text-silver-light" />
                </div>
                <div>
                  <span className="text-silver-light font-medium text-sm block">
                    Accès Premium
                  </span>
                  <span className="text-xs text-muted-foreground">
                    10,99€ à vie
                  </span>
                </div>
              </div>
              <span className="text-silver text-sm">→</span>
            </div>
          </PremiumCard>
        </button>
      )}

      {/* CTA Button */}
      <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
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
