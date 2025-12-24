import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, BellOff, Clock, Crown, Check } from 'lucide-react';
import { PremiumCard } from '@/components/PremiumCard';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const reminderIntervals = [
  { value: 1, label: '1 heure' },
  { value: 2, label: '2 heures' },
  { value: 4, label: '4 heures' },
  { value: 8, label: '8 heures' },
  { value: 24, label: '1 jour' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { hasPremiumAccess } = useAuth();
  const { 
    permission, 
    settings, 
    isSupported, 
    toggleNotifications, 
    updateSettings,
    sendNotification 
  } = useNotifications();

  const handleToggle = async () => {
    if (permission === 'denied') {
      toast.error('Les notifications sont bloquées. Autorise-les dans les paramètres du navigateur.');
      return;
    }
    await toggleNotifications();
  };

  const handleIntervalChange = (value: number) => {
    updateSettings({ reminderInterval: value });
    if (settings.enabled) {
      toast.success(`Rappel toutes les ${reminderIntervals.find(i => i.value === value)?.label}`);
    }
  };

  const sendTestNotification = () => {
    sendNotification('Test de notification 🔔', {
      body: 'Les rappels fonctionnent correctement !',
    });
    toast.success('Notification envoyée !');
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold silver-text">
            Paramètres
          </h1>
          <p className="text-muted-foreground text-sm">
            Notifications et préférences
          </p>
        </div>
      </header>

      {/* Premium Status */}
      <PremiumCard className="mb-6 animate-slide-up" frost>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${hasPremiumAccess ? 'bg-success/10' : 'bg-warning/10'}`}>
            {hasPremiumAccess ? (
              <Crown className="w-5 h-5 text-success" />
            ) : (
              <Clock className="w-5 h-5 text-warning" />
            )}
          </div>
          <div>
            <span className={`text-sm font-medium block ${hasPremiumAccess ? 'text-success' : 'text-warning'}`}>
              {hasPremiumAccess ? 'Accès Premium' : 'Mode essai'}
            </span>
            <span className="text-xs text-muted-foreground">
              {hasPremiumAccess ? 'Toutes les fonctionnalités débloquées' : 'Fonctionnalités limitées'}
            </span>
          </div>
        </div>
      </PremiumCard>

      {/* Notifications Section */}
      <PremiumCard className="mb-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </h3>

        {!isSupported ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <BellOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Ton navigateur ne supporte pas les notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Toggle notifications */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-silver-light text-sm font-medium block">
                  Rappels de focus
                </span>
                <span className="text-xs text-muted-foreground">
                  {permission === 'denied' 
                    ? 'Bloqué par le navigateur' 
                    : 'Recevoir des rappels réguliers'}
                </span>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={handleToggle}
                disabled={permission === 'denied'}
              />
            </div>

            {/* Reminder interval */}
            {settings.enabled && (
              <div className="pt-4 border-t border-border/50 animate-fade-in">
                <span className="text-sm text-muted-foreground block mb-3">
                  Fréquence des rappels
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {reminderIntervals.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleIntervalChange(value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        settings.reminderInterval === value
                          ? 'bg-silver/20 text-silver-light border border-silver/30'
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Test button */}
                <button
                  onClick={sendTestNotification}
                  className="w-full mt-4 py-2 px-4 rounded-lg bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Tester les notifications
                </button>
              </div>
            )}
          </div>
        )}
      </PremiumCard>

      {/* Info */}
      <p className="text-center text-muted-foreground/60 text-xs animate-fade-in" style={{ animationDelay: '0.1s' }}>
        Les notifications t'aident à maintenir ta discipline
      </p>
    </div>
  );
}
