import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { ProgressRing } from '@/components/ProgressRing';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/hooks/useAppState';
import type { Task } from '@/types/app';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function FocusMode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addSession } = useAppState();
  const task = location.state?.task as Task | undefined;

  const [timeRemaining, setTimeRemaining] = useState(task ? task.duration * 60 : 0);
  const [isRunning, setIsRunning] = useState(true);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout>();

  const totalSeconds = task ? task.duration * 60 : 0;
  const progress = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const handleComplete = useCallback(() => {
    if (!task) return;
    
    const actualDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    addSession({
      taskId: task.id,
      taskName: task.name,
      objective: task.objective,
      duration: task.duration,
      actualDuration,
      status: 'completed',
      scoreEarned: 5,
    });

    navigate('/complete', {
      state: {
        task,
        actualDuration,
        status: 'completed',
      },
    });
  }, [task, addSession, navigate]);

  const handleAbandon = useCallback(() => {
    if (!task) return;
    
    const actualDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    addSession({
      taskId: task.id,
      taskName: task.name,
      objective: task.objective,
      duration: task.duration,
      actualDuration,
      status: 'abandoned',
      scoreEarned: -10,
    });

    navigate('/complete', {
      state: {
        task,
        actualDuration,
        status: 'abandoned',
      },
    });
  }, [task, addSession, navigate]);

  useEffect(() => {
    if (!task) {
      navigate('/create');
      return;
    }

    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [task, isRunning, navigate, handleComplete, timeRemaining]);

  if (!task) {
    return null;
  }

  const { minutes, seconds } = formatTime(timeRemaining);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4">
      {/* Progress Ring with Timer */}
      <div className="animate-scale-in">
        <ProgressRing progress={progress} size={280} strokeWidth={12}>
          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-7xl font-semibold text-counter silver-text">
                {minutes}
              </span>
              <span className="text-4xl text-muted-foreground mx-2 animate-pulse-slow">
                :
              </span>
              <span className="text-7xl font-semibold text-counter silver-text">
                {seconds}
              </span>
            </div>
          </div>
        </ProgressRing>
      </div>

      {/* Task Info */}
      <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-semibold text-silver-light mb-2">
          {task.name}
        </h2>
        {task.objective && (
          <p className="text-muted-foreground text-sm max-w-xs">
            {task.objective}
          </p>
        )}
      </div>

      {/* Contract Message */}
      <p className="absolute bottom-32 text-muted-foreground/60 text-xs text-center px-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        Contrat actif. Pas de retour en arrière.
      </p>

      {/* Abandon Button */}
      <button
        onClick={() => setShowAbandonDialog(true)}
        className="absolute bottom-16 text-muted-foreground/40 text-xs hover:text-destructive/60 transition-colors duration-300"
      >
        Abandonner la session
      </button>

      {/* Abandon Confirmation Dialog */}
      <AlertDialog open={showAbandonDialog} onOpenChange={setShowAbandonDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-silver-light">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Abandonner la session ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Abandonner maintenant affectera ton score de discipline. 
              Chaque minute d'effort compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border text-foreground hover:bg-secondary/80">
              Continuer
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAbandon}
              className="bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30"
            >
              Abandonner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
