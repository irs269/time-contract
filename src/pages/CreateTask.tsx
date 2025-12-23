import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Target, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PremiumCard } from '@/components/PremiumCard';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/app';

const quickDurations = [
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
];

export default function CreateTask() {
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [objective, setObjective] = useState('');
  const [duration, setDuration] = useState<number>(25);
  const [customDuration, setCustomDuration] = useState('');

  const isValid = taskName.trim() && duration > 0;

  const handleQuickDuration = (value: number) => {
    setDuration(value);
    setCustomDuration('');
  };

  const handleCustomDuration = (value: string) => {
    setCustomDuration(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setDuration(num);
    }
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const task: Task = {
      id: crypto.randomUUID(),
      name: taskName.trim(),
      objective: objective.trim(),
      duration,
      createdAt: new Date(),
    };

    // Navigate to focus mode with task data
    navigate('/focus', { state: { task } });
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-8">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold silver-text mb-2">
          Vendre mon temps
        </h1>
        <p className="text-muted-foreground text-sm">
          Définis ton engagement
        </p>
      </header>

      {/* Task Name */}
      <PremiumCard className="mb-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-silver/10">
            <FileSignature className="w-5 h-5 text-silver" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Nom de la tâche
          </span>
        </div>
        <Input
          placeholder="Ex: Étude approfondie"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12"
        />
      </PremiumCard>

      {/* Objective */}
      <PremiumCard className="mb-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-silver/10">
            <Target className="w-5 h-5 text-silver" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Objectif à atteindre
          </span>
        </div>
        <Input
          placeholder="Ex: Terminer le chapitre 5"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12"
        />
      </PremiumCard>

      {/* Duration Selection */}
      <PremiumCard className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-silver/10">
            <Clock className="w-5 h-5 text-silver" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Durée du contrat
          </span>
        </div>

        {/* Quick buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickDurations.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleQuickDuration(value)}
              className={cn(
                'py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300',
                duration === value && !customDuration
                  ? 'bg-silver/20 text-silver-light border border-silver/40'
                  : 'bg-secondary/50 text-muted-foreground border border-transparent hover:border-border'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom duration */}
        <div className="flex items-center gap-3">
          <Input
            type="number"
            placeholder="Personnalisé"
            value={customDuration}
            onChange={(e) => handleCustomDuration(e.target.value)}
            className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground h-12 flex-1"
          />
          <span className="text-muted-foreground text-sm">minutes</span>
        </div>
      </PremiumCard>

      {/* Inspirational message */}
      <p className="text-center text-muted-foreground text-sm mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        « Chaque minute compte. »
      </p>

      {/* Submit Button */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Button
          variant="premium"
          size="xl"
          className="w-full animate-border-glow"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          <FileSignature className="w-5 h-5" />
          Signer le contrat
        </Button>
      </div>
    </div>
  );
}
