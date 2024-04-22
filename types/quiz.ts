import { Profession } from './profession';

export interface QuestionAnalysis {
  rating: number;
  explanation: string;
}

interface QuestionAttributes {
  topic: string;
}

export interface SimpleQuestion {
  id: string;
  question: string;
  userAnswer?: string;
}

export interface Question extends SimpleQuestion {
  analysis?: QuestionAnalysis;
  attributes: QuestionAttributes;
}

export interface QuizAttributes {
  profession: Profession;
  topics: number;
  quesPerTopic: number;
  includedAreas: string[];
  excludedAreas: string[];
  exclusiveAreas: string[];
}

export interface Quiz {
  _id?: string;
  questions: Question[];
  attributes: QuizAttributes;
}
