export type Gender = 'Male' | 'Female' | 'Other';
export type Goal = 'Fat Loss' | 'Muscle Gain' | 'Strength' | 'General Fitness';
export type Experience = 'Beginner' | 'Intermediate' | 'Advanced';
export type Location = 'Home' | 'Gym';
export type TimeAvailable = '20-30 min' | '45 min' | '60+ min';

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  experience: Experience;
  location: Location;
  timeAvailable: TimeAvailable;
  injuries: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  muscle: string;
  postureTips: string;
  mistakes: string;
  youtubeQuery: string;
}

export interface WorkoutDay {
  day: string; // e.g. "Day 1 - Push"
  exercises: Exercise[];
}

export interface MealOption {
  name: string;
  description: string;
}

export interface DietPlan {
  proteinTarget: string;
  calories: string;
  tips: string[];
  meals: {
    breakfast: MealOption[];
    lunch: MealOption[];
    snack: MealOption[];
    dinner: MealOption[];
  };
}

export interface GeneratedPlan {
  intro: string;
  schedule: WorkoutDay[];
  diet: DietPlan;
  safety: string[];
  motivation: string;
}
