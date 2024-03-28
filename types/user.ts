import { Quiz } from './quiz';

export interface AppUserInfo {
  authId: string;
  email: string;
}

export interface AppUser extends AppUserInfo {
  _id?: string;
  quizzes: Quiz[];
}
