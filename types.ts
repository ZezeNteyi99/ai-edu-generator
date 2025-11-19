export enum ContentType {
  StudyGuide = 'study_guide',
  Quiz = 'quiz',
}

export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum Grade {
  Grade10 = 'Grade 10',
  Grade11 = 'Grade 11',
  Grade12 = 'Grade 12',
}

export enum Tone {
  Academic = 'Academic',
  Simple = 'Simple',
  Conversational = 'Conversational',
}

export enum Length {
  Brief = 'Brief',
  Standard = 'Standard',
  Detailed = 'Detailed',
}

export interface GenerateOptions {
  topic: string;
  contentType: ContentType;
  difficulty: Difficulty;
  length: Length;
  grade: Grade;
  tone: Tone;
  instructions: string;
}

export interface PerformanceMetrics {
  generationTime: string; // in seconds
}

export interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface ShortAnswerQuestion {
  question: string;
  answer: string;
}

export interface QuizData {
  title: string;
  multipleChoice: MultipleChoiceQuestion[];
  shortAnswer: ShortAnswerQuestion[];
}
