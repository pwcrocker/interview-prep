import { findQuizOverviewsByUser, findQuizzesByUser, findUserBySub } from './db';
import { logJson } from './logger';

export async function getUserBySub(sub: string) {
  const user = await findUserBySub(sub);
  logJson('user: ', user);
  return user;
}

export async function getQuizzesByUser(sub: string, limit: number = 3, curPage: number = 0) {
  if (limit > 25 || limit < 3 || curPage > 20) {
    throw new Error('Bad limit or page');
  }
  const quizzes = await findQuizzesByUser(sub, limit, curPage * limit);
  logJson('quizzes: ', quizzes);
  return quizzes;
}

export async function getQuizOverviewsByUser(sub: string, limit: number = 3, curPage: number = 0) {
  if (limit > 25 || limit < 3 || curPage > 20) {
    throw new Error('Bad limit or page');
  }
  const overviews = await findQuizOverviewsByUser(sub, limit, curPage * limit);
  return overviews;
}
