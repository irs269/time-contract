import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, CreditCard, Shield, Zap, Clock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/PremiumCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const features = [
  { icon: Clock, text: 'Accès illimité à vie' },
  { icon: Zap, text: 'Toutes les fonctionnalités premium' },
  { icon: Shield, text: 'Synchronisation cloud' },
  { icon: Crown, text: 'Badges exclusifs' },
];

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: 'lifetime_access' },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erreur lors du paiement. Réessaie plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-silver-light transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold silver-text">
            Accès Premium
          </h1>
          <p className="text-muted-foreground text-sm">
            Paiement unique, accès à vie
          </p>
        </div>
      </header>

      {/* Premium Card */}
      <PremiumCard className="mb-6 animate-slide-up text-center" frost glow>
        <div className="py-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-silver/20 to-silver/5 mb-4">
            <Crown className="w-10 h-10 text-silver-light" />
          </div>
          
          <h2 className="text-xl font-semibold text-silver-light mb-2">
            Accès à Vie
          </h2>
          
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold silver-text">10,99</span>
            <span className="text-xl text-muted-foreground">€</span>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Paiement unique • Sans abonnement
          </p>
        </div>
      </PremiumCard>

      {/* Features */}
      <PremiumCard className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Inclus dans l'accès premium
        </h3>
        <div className="space-y-3">
          {features.map(({ icon: Icon, text }, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <div className="p-2 rounded-lg bg-success/10">
                <Check className="w-4 h-4 text-success" />
              </div>
              <span className="text-silver-light">{text}</span>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Payment Button */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Button
          variant="premium"
          size="xl"
          className="w-full animate-border-glow"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Chargement...</span>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Payer 10,99 €
            </>
          )}
        </Button>

        <p className="text-center text-muted-foreground/60 text-xs mt-4">
          Paiement sécurisé par Stripe
        </p>
      </div>
    </div>
  );
}
