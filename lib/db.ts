'use server';

import postgres from 'postgres';
import { log } from 'console';
import { EphemeralQuiz, PersistedQuiz } from '@/types/quiz';
import { QuizDAO } from '@/types/dao';
import { EphemeralQuestion, PersistedQuestion } from '@/types/question';
import { EphemeralGradedUserAnswer, PersistedUserAnswer } from '@/types/answer';
import { logJson } from './logger';
// import { PreliminaryQuiz, QuizResponse } from '@/types/createQuiz';
// import { QuizAttributes } from '@/types/quiz';

const {
  PREP_POSTGRES_WRITE_USER,
  PREP_POSTGRES_WRITE_PASSWORD,
  PREP_POSTGRES_HOST,
  PREP_POSTGRES_PORT,
  PREP_POSTGRES_DB,
} = process.env;

const databaseUrl: string = `postgres://${PREP_POSTGRES_WRITE_USER}:${PREP_POSTGRES_WRITE_PASSWORD}@${PREP_POSTGRES_HOST}:${PREP_POSTGRES_PORT}/${PREP_POSTGRES_DB}`;

const sql = postgres(databaseUrl);

// export default sql;

export async function findUserBySub(sub: string) {
  const users = await sql`
    SELECT * FROM _users WHERE user_sub = ${sub}
  `;
  return users[0];
}

export async function insertUser(sub: string, email: string) {
  const newUser = await sql`
    INSERT INTO _users (user_sub, email) VALUES (${sub}, ${email})
  `;
  log('Inserting new user');
  return newUser;
}

function createQuestionsInsertQuery(quiz_questions: EphemeralQuestion[]) {
  return sql<PersistedQuestion[]>`
    INSERT INTO 
    questions ${sql<EphemeralQuestion[], ['question', 'question_topic']>(quiz_questions, 'question', 'question_topic')}
    RETURNING *
  `;
}

function createQuizInsertQuery(sub: string, quizToSave: EphemeralQuiz) {
  const { subject_area, difficulty_modifier, included_topics, excluded_topics, exclusive_topics } =
    quizToSave as QuizDAO;

  return sql<PersistedQuiz[]>`
    INSERT INTO 
    quizzes(
      user_sub, 
      subject_area, 
      difficulty_modifier, 
      included_topics, 
      excluded_topics, 
      exclusive_topics
    )
    VALUES (
      ${sub}, 
      ${subject_area}, 
      ${difficulty_modifier}, 
      ${included_topics || null}, 
      ${excluded_topics || null}, 
      ${exclusive_topics || null}
    ) RETURNING *`;
}

function createQuizQuestionsInsertQuery(
  quiz_question_ids: { quiz_id: string; question_id: string }[]
) {
  return sql`
    INSERT INTO 
    quiz_questions ${sql(quiz_question_ids, 'quiz_id', 'question_id')}
  `;
}

// TODO types feel like a mess here
export async function insertQuiz(sub: string, quizToSave: EphemeralQuiz) {
  // save quiz
  const quizResults = await createQuizInsertQuery(sub, quizToSave);
  if (!quizResults) {
    throw new Error('Failed to save quiz to database');
  }
  const persistedQuiz = quizResults[0];

  logJson('what is this2: ', quizToSave.quiz_questions);
  // save questions
  const questionsResults = await createQuestionsInsertQuery(quizToSave.quiz_questions);
  if (!questionsResults) {
    throw new Error('Failed to save questions to database');
  }
  logJson('what is this: ', questionsResults);
  persistedQuiz.quiz_questions = questionsResults;

  // update join table for many-to-many
  const quizQuestionsResults = await createQuizQuestionsInsertQuery(
    questionsResults.map((q) => ({
      quiz_id: persistedQuiz.quiz_id,
      question_id: q.question_id,
    }))
  );
  if (!quizQuestionsResults) {
    throw new Error('Failed to save quiz_questions to database');
  }

  return persistedQuiz;
}

function createAnswersInsertQuery(gradedAnswers: EphemeralGradedUserAnswer[]) {
  return sql<PersistedUserAnswer[]>`
    INSERT INTO 
    user_answers ${sql<
      EphemeralGradedUserAnswer[],
      ['user_sub', 'question_id', 'user_answer', 'ai_summary_analysis', 'ai_detailed_analysis']
    >(
      gradedAnswers,
      'user_sub',
      'question_id',
      'user_answer',
      'ai_summary_analysis',
      'ai_detailed_analysis'
    )}
    RETURNING *
  `;
}

export async function insertAnswers(quiz_id: string, gradedAnswers: EphemeralGradedUserAnswer[]) {
  logJson('what are these answers: ', gradedAnswers);
  const answers = await createAnswersInsertQuery(gradedAnswers);
  if (!answers) {
    throw new Error('Failed to save user answers to database');
  }
  logJson('did it return the answers: ', answers);
  await sql`UPDATE quizzes SET is_graded = TRUE WHERE quiz_id = ${quiz_id}`;
  return answers as PersistedUserAnswer[];
}

export async function updateUserTokensReturningTokens(userSub: string, tokenChange: number) {
  const user = await sql`
    UPDATE _users
    SET tokens = tokens + ${tokenChange}
    WHERE user_sub = ${userSub}
    RETURNING tokens
  `;
  log(`Updated tokens: ${user[0]?.tokens}`);
  return user[0].tokens;
}
