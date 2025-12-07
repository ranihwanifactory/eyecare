import { LucideIcon } from 'lucide-react';

export enum ExerciseType {
  FIGURE_EIGHT = 'FIGURE_EIGHT',
  PALMING = 'PALMING',
  FOCUS_CHANGE = 'FOCUS_CHANGE',
  BLINKING = 'BLINKING',
  RULE_20_20_20 = 'RULE_20_20_20',
  CIRCLE = 'CIRCLE',
  LEFT_RIGHT = 'LEFT_RIGHT',
  RANDOM = 'RANDOM'
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  description: string;
  durationSeconds: number;
  icon: LucideIcon;
  color: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions: string[];
}

export interface HistoryRecord {
  date: string; // ISO string
  exerciseId: string;
}