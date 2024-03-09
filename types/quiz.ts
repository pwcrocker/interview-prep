import { Profession } from './profession';

export interface QuestionAnalysis {
  summary: string;
  detailed: string;
}

interface QuestionAttributes {
  topic: string;
}

export interface Question {
  question: string;
  userAnswer?: string;
  analysis?: QuestionAnalysis;
  attributes: QuestionAttributes;
}

interface QuizAttributes {
  profession: Profession;
}

export interface Quiz {
  questions: Question[];
  attributes: QuizAttributes;
}
