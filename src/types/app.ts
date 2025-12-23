export interface Task {
  id: string;
  name: string;
  objective: string;
  duration: number; // in minutes
  createdAt: Date;
}

export interface Session {
  id: string;
  taskId: string;
  taskName: string;
  objective: string;
  duration: number; // planned duration in minutes
  actualDuration: number; // actual duration in seconds
  status: 'completed' | 'abandoned';
  completedAt: Date;
  scoreEarned: number;
}

export interface AppState {
  totalTimeSold: number; // in seconds
  disciplineScore: number; // 0-100
  sessions: Session[];
  currentStreak: number;
}
