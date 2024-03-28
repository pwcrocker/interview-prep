import { QuizAttributes } from './quiz';

export interface GeneratedQuestion {
  id: string;
  question: string;
}

export interface QuizTopicItem {
  topic: string;
  questions: GeneratedQuestion[];
}

export interface QuizResponse {
  quizItems: QuizTopicItem[];
}

export interface PreliminaryQuiz {
  quiz: QuizResponse;
  attributes: QuizAttributes;
}
