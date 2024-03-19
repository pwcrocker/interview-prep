import { Quiz } from './quiz';

export interface User {
  authId: string;
  email: string;
  quizzes: Quiz[];
}
