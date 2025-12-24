import { useNavigate } from 'react-router-dom';
import { Clock, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/PremiumCard';
import { useAuth } from '@/contexts/AuthContext';

export function TrialExpiredOverlay() {
  const navigate = useNavigate();
  const { trialExpired, hasPremiumAccess, user } = useAuth();

  // Don't show if user has premium access or trial not expired
  if (!user || hasPremiumAccess || !trialExpired) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4">
      <PremiumCard className="max-w-sm w-full text-center animate-scale-in" frost glow>
        <div className="py-6">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-silver/20 to-silver/5 mb-4">
            <Lock className="w-12 h-12 text-silver-light" />
          </div>

          <h2 className="text-2xl font-bold silver-text mb-2">
            Essai terminé
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Tes 2 minutes d'essai sont écoulées. 
            Débloque l'accès à vie pour continuer.
          </p>

          <div className="space-y-3">
            <Button
              variant="premium"
              size="xl"
              className="w-full animate-border-glow"
              onClick={() => navigate('/payment')}
            >
              <Crown className="w-5 h-5" />
              Débloquer pour 10,99 €
            </Button>

            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Paiement unique, accès à vie</span>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}
