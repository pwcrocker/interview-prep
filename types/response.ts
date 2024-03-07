import { Profession } from './profession';

export interface QuizTopicItem {
  topic: string;
  questions: string[];
}

export interface QuizResponse {
  quizTopics: QuizTopicItem[];
}

export interface StitchedResponse {
  response: QuizResponse;
  profession: Profession;
}
