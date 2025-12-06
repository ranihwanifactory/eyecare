export enum ExerciseType {
  SMOOTH_PURSUIT = 'SMOOTH_PURSUIT', // Following a moving object
  SACCADE = 'SACCADE', // Jumping focus between points
  BLINKING = 'BLINKING', // Conscious blinking
  NEAR_FAR = 'NEAR_FAR', // Focus change
  PALMING = 'PALMING', // Relaxation
  HORIZONTAL_TRACKING = 'HORIZONTAL_TRACKING' // Left-Right tracking
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  durationSeconds: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions: string;
}

export interface UserHistory {
  date: string;
  exerciseId: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}