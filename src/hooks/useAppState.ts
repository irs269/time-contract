import { useState, useEffect, useCallback } from 'react';
import type { AppState, Session } from '@/types/app';

const STORAGE_KEY = 'je-vends-mon-temps-state';

const initialState: AppState = {
  totalTimeSold: 0,
  disciplineScore: 50,
  sessions: [],
  currentStreak: 0,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          sessions: parsed.sessions.map((s: Session) => ({
            ...s,
            completedAt: new Date(s.completedAt),
          })),
        };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  const addSession = useCallback((session: Omit<Session, 'id' | 'completedAt'>) => {
    const newSession: Session = {
      ...session,
      id: crypto.randomUUID(),
      completedAt: new Date(),
    };

    setState((prev) => {
      const newTotalTime = prev.totalTimeSold + (session.status === 'completed' ? session.actualDuration : 0);
      
      // Calculate new discipline score
      let scoreDelta = 0;
      if (session.status === 'completed') {
        const completionRate = session.actualDuration / (session.duration * 60);
        scoreDelta = Math.min(5, Math.round(completionRate * 5));
      } else {
        scoreDelta = -10; // Penalty for abandoning
      }

      const newScore = Math.max(0, Math.min(100, prev.disciplineScore + scoreDelta));

      // Update streak
      const today = new Date().toDateString();
      const lastSession = prev.sessions[0];
      const lastSessionDate = lastSession ? new Date(lastSession.completedAt).toDateString() : null;
      
      let newStreak = prev.currentStreak;
      if (session.status === 'completed') {
        if (lastSessionDate !== today) {
          newStreak = prev.currentStreak + 1;
        }
      } else {
        newStreak = 0;
      }

      return {
        ...prev,
        totalTimeSold: newTotalTime,
        disciplineScore: newScore,
        sessions: [newSession, ...prev.sessions],
        currentStreak: newStreak,
      };
    });

    return newSession;
  }, []);

  const getFormattedTime = useCallback(() => {
    const totalMinutes = Math.floor(state.totalTimeSold / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }, [state.totalTimeSold]);

  const getSessionsByPeriod = useCallback((period: 'day' | 'week' | 'month') => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let startDate: Date;
    switch (period) {
      case 'day':
        startDate = startOfDay;
        break;
      case 'week':
        startDate = startOfWeek;
        break;
      case 'month':
        startDate = startOfMonth;
        break;
    }

    return state.sessions.filter((s) => new Date(s.completedAt) >= startDate);
  }, [state.sessions]);

  return {
    state,
    addSession,
    getFormattedTime,
    getSessionsByPeriod,
  };
}
