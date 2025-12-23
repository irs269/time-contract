import { Trophy, Flame, Clock, Target, Star, Zap, Crown, Medal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  requirement: (stats: BadgeStats) => boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface BadgeStats {
  totalTimeSold: number; // in seconds
  sessionsCompleted: number;
  currentStreak: number;
  disciplineScore: number;
  longestSession: number; // in seconds
}

export const BADGES: Badge[] = [
  // Time-based badges
  {
    id: 'first-hour',
    name: 'Première Heure',
    description: '1 heure de temps vendue',
    icon: Clock,
    requirement: (stats) => stats.totalTimeSold >= 3600,
    tier: 'bronze',
  },
  {
    id: 'ten-hours',
    name: 'Déterminé',
    description: '10 heures de temps vendues',
    icon: Clock,
    requirement: (stats) => stats.totalTimeSold >= 36000,
    tier: 'silver',
  },
  {
    id: 'fifty-hours',
    name: 'Maître du Temps',
    description: '50 heures de temps vendues',
    icon: Clock,
    requirement: (stats) => stats.totalTimeSold >= 180000,
    tier: 'gold',
  },
  {
    id: 'hundred-hours',
    name: 'Légende',
    description: '100 heures de temps vendues',
    icon: Crown,
    requirement: (stats) => stats.totalTimeSold >= 360000,
    tier: 'platinum',
  },

  // Session-based badges
  {
    id: 'first-session',
    name: 'Premier Contrat',
    description: 'Première session complétée',
    icon: Target,
    requirement: (stats) => stats.sessionsCompleted >= 1,
    tier: 'bronze',
  },
  {
    id: 'ten-sessions',
    name: 'Engagé',
    description: '10 sessions complétées',
    icon: Target,
    requirement: (stats) => stats.sessionsCompleted >= 10,
    tier: 'silver',
  },
  {
    id: 'fifty-sessions',
    name: 'Discipline de Fer',
    description: '50 sessions complétées',
    icon: Medal,
    requirement: (stats) => stats.sessionsCompleted >= 50,
    tier: 'gold',
  },

  // Streak badges
  {
    id: 'three-day-streak',
    name: 'Régularité',
    description: '3 jours consécutifs',
    icon: Flame,
    requirement: (stats) => stats.currentStreak >= 3,
    tier: 'bronze',
  },
  {
    id: 'seven-day-streak',
    name: 'Semaine Parfaite',
    description: '7 jours consécutifs',
    icon: Flame,
    requirement: (stats) => stats.currentStreak >= 7,
    tier: 'silver',
  },
  {
    id: 'thirty-day-streak',
    name: 'Habitude Forgée',
    description: '30 jours consécutifs',
    icon: Flame,
    requirement: (stats) => stats.currentStreak >= 30,
    tier: 'gold',
  },

  // Score badges
  {
    id: 'score-75',
    name: 'Performant',
    description: 'Score de discipline à 75',
    icon: Star,
    requirement: (stats) => stats.disciplineScore >= 75,
    tier: 'silver',
  },
  {
    id: 'score-90',
    name: 'Excellence',
    description: 'Score de discipline à 90',
    icon: Star,
    requirement: (stats) => stats.disciplineScore >= 90,
    tier: 'gold',
  },
  {
    id: 'score-100',
    name: 'Perfection',
    description: 'Score de discipline parfait',
    icon: Trophy,
    requirement: (stats) => stats.disciplineScore >= 100,
    tier: 'platinum',
  },

  // Long session badges
  {
    id: 'marathon-1h',
    name: 'Marathonien',
    description: 'Session de 1 heure complétée',
    icon: Zap,
    requirement: (stats) => stats.longestSession >= 3600,
    tier: 'silver',
  },
  {
    id: 'marathon-2h',
    name: 'Ultra Focus',
    description: 'Session de 2 heures complétée',
    icon: Zap,
    requirement: (stats) => stats.longestSession >= 7200,
    tier: 'gold',
  },
];

export const TIER_COLORS = {
  bronze: {
    bg: 'bg-amber-900/20',
    border: 'border-amber-700/40',
    text: 'text-amber-500',
    glow: 'shadow-[0_0_15px_hsl(25_80%_40%/0.3)]',
  },
  silver: {
    bg: 'bg-silver/10',
    border: 'border-silver/40',
    text: 'text-silver-light',
    glow: 'shadow-[0_0_15px_hsl(200_20%_80%/0.3)]',
  },
  gold: {
    bg: 'bg-yellow-600/20',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_15px_hsl(45_90%_50%/0.4)]',
  },
  platinum: {
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/40',
    text: 'text-cyan-300',
    glow: 'shadow-[0_0_20px_hsl(185_70%_60%/0.4)]',
  },
};
