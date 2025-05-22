
import { ExerciseType } from "@/services/exerciseService";

export interface WorkoutHistory {
  id: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration: number; // in seconds
}

export interface WorkoutExercise {
  type: ExerciseType;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSet {
  reps: number;
  formIssues: string[];
  completed: boolean;
}

export interface UserSettings {
  cameraEnabled: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  formFeedbackLevel: 'basic' | 'detailed';
  repCountingThreshold: number;
}
