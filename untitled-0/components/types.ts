export enum Feature {
  Chat = 'Chat',
  Breathing = 'Atemübung',
  Mood = 'Stimmung',
  Affirmation = 'Affirmation',
  Gedankenprotokoll = 'Gedankenprotokoll',
  Ziele = 'Ziele',
}

export interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
}

export interface Mood {
  emoji: string;
  label: string;
}

export interface MoodLog extends Mood {
  id?: string; // local ID
  date: string;
  thoughts?: string;
}

export type Personality = 'Fürsorglich' | 'Motivierend' | 'Neugierig' | 'Prägnant';

export interface EmotionRating {
  name: string;
  intensity: number;
}

export interface ThoughtRecord {
  id: string;
  date: string;
  situation: string;
  initialEmotions: EmotionRating[];
  automaticThoughts: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  outcomeEmotions: EmotionRating[];
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}