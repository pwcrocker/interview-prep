'use server';

import postgres from 'postgres';
import { log } from 'console';
import { ProposedQuizAttributes, QuizOverview } from '@/types/quiz';
import { QuestionDAO, QuizDAO, UserDAO } from '@/types/dao';
import { EphemeralQuestion } from '@/types/question';
import { EphemeralGradedUserAnswer, PersistedUserAnswer } from '@/types/answer';
import { USER_TIER } from '@/types/enum';
import { logJson } from './logger';

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

// user_id, user_sub, username, email, paid_tier
export async function findUserBySub<K extends keyof UserDAO>(sub: string, col?: K[]) {
  log(`Finding user by user_sub: ${sub}`);
  log(`Potentially joining columns: ${col && col.join()}`);
  const colStr = col && col.join();
  let query;
  if (colStr) {
    query = sql<Partial<UserDAO>[]>`SELECT ${colStr} FROM _users WHERE user_sub = ${sub}`;
  } else {
    query = sql<
      Partial<UserDAO>[]
    >`SELECT user_id,user_sub,username,email,paid_tier FROM _users WHERE user_sub = ${sub}`;
  }
  log(query);
  const [user] = await query;
  logJson('user', user);

  if (!user) {
    throw new Error(`Failed to find user: ${sub}`);
  }
  log(`Returning user for user_sub: ${sub}`);
  return user;
}

export async function findQuizzesByUser(sub: string, limit: number = 3, offset: number = 0) {
  const quizzes = await sql<
    QuizDAO[]
  >`SELECT * from quizzes WHERE user_sub = ${sub} LIMIT ${limit} OFFSET ${offset}`;
  return quizzes;
}

export async function findQuizOverviewsByUser(sub: string, limit: number = 3, offset: number = 0) {
  const quizOverviews = await sql<QuizOverview[]>`
    SELECT * FROM get_quiz_overviews_by_user(${sub}) 
    LIMIT ${limit} 
    OFFSET ${offset}`;
  return quizOverviews;
}

export async function insertUser(sub: string, email: string) {
  log('Inserting new user');
  const [newUser] = await sql`
    INSERT INTO _users (user_sub, email) VALUES (${sub}, ${email}) RETURNING user_id
  `;
  if (!newUser) {
    throw new Error('Failed to insert new user');
  }
  log('Inserted user');
  return newUser[0];
}

/**
 * Inserts new quiz, questions, and quiz_questions mapping as a single transaction
 * @param sub - user_sub
 * @param quizToSave - ephemeral quiz that has yet to be saved to db
 * @returns array with persisted quiz at 0 and persisted questions at 1
 */
export async function insertQuiz(
  sub: string,
  proposedQuiz: ProposedQuizAttributes,
  questionsToSave: EphemeralQuestion[]
) {
  const [persistedQuiz, persistedQuestions, qqRelation] = await sql.begin(async (scopedSql) => {
    const {
      quiz_type,
      subject_area,
      difficulty,
      included_topics_arr,
      excluded_topics_arr,
      exclusive_topics_arr,
    } = proposedQuiz;

    log(`sub: ${sub}`);
    logJson('proposed quiz', proposedQuiz);
    log(`arr1: ${included_topics_arr.join()}`);
    log(`arr2: ${excluded_topics_arr.join()}`);
    log(`arr3: ${exclusive_topics_arr.join()}`);

    const [resultQuiz] = await scopedSql<QuizDAO[]>`
      INSERT INTO 
      quizzes(
        user_sub,
        quiz_type,
        subject_area,
        difficulty, 
        included_topics, 
        excluded_topics, 
        exclusive_topics
      )
      VALUES (
        ${sub},
        ${quiz_type},
        ${subject_area}, 
        ${difficulty}, 
        ${included_topics_arr.length > 0 ? included_topics_arr.join() : null}, 
        ${excluded_topics_arr.length > 0 ? excluded_topics_arr.join() : null}, 
        ${exclusive_topics_arr.length > 0 ? exclusive_topics_arr.join() : null}
      ) RETURNING *
    `;

    logJson('ques: ', questionsToSave);

    const resultQuestions = await scopedSql<QuestionDAO[]>`
      INSERT INTO 
      questions ${scopedSql<EphemeralQuestion[], ['ques_text', 'ques_topic']>(questionsToSave, 'ques_text', 'ques_topic')}
      RETURNING *
    `;

    const resultQuizId = resultQuiz.quiz_id;
    const quizQuesMapping = resultQuestions.map((q) => ({
      quiz_id: resultQuizId,
      ques_id: q.ques_id,
    }));

    logJson('relation: ', quizQuesMapping);

    const resultRelation = await scopedSql`
      INSERT INTO 
      quiz_questions ${scopedSql(quizQuesMapping, 'quiz_id', 'ques_id')}
    `;

    return [resultQuiz, resultQuestions, resultRelation];
  });

  if (!persistedQuiz) {
    throw new Error('Failed to save quiz');
  } else if (!persistedQuestions || !persistedQuestions[0]) {
    throw new Error('Failed to save questions');
  } else if (!qqRelation) {
    throw new Error('Failed to save quiz_questions relation');
  }
  return { persistedQuiz, persistedQuestions: Array.from(persistedQuestions) };
}

export async function isQuizGraded(quiz_id: string) {
  const [result] = await sql`SELECT is_graded FROM quizzes WHERE quiz_id = ${quiz_id}`;
  log(`quiz: ${quiz_id}`);
  logJson('how is this graded', result);
  logJson('how is this graded', result.is_graded);
  return result.is_graded;
}

export async function insertAnswers(quiz_id: string, gradedAnswers: EphemeralGradedUserAnswer[]) {
  logJson('about to try saving answers: ', gradedAnswers);
  logJson('about to try saving answers, quiz id: ', quiz_id);
  const [persistedAnswers, resultQuizId] = await sql.begin(async (scopedSql) => {
    const resultAnswers = await scopedSql<PersistedUserAnswer[]>`
      INSERT INTO 
      user_answers ${scopedSql<
        EphemeralGradedUserAnswer[],
        ['user_sub', 'ques_id', 'user_answer', 'summary_analysis', 'detailed_analysis']
      >(
        gradedAnswers,
        'user_sub',
        'ques_id',
        'user_answer',
        'summary_analysis',
        'detailed_analysis'
      )}
      RETURNING *
    `;
    const [quizId] =
      await scopedSql`UPDATE quizzes SET is_graded = TRUE WHERE quiz_id = ${quiz_id} RETURNING quiz_id`;
    return [resultAnswers, quizId];
  });

  if (!persistedAnswers || !persistedAnswers[0] || !resultQuizId) {
    throw new Error('Failed to save user answers and update quiz to graded');
  }

  return Array.from(persistedAnswers);
}

export async function updateUserPaidTier(sub: string, paid_tier: USER_TIER) {
  const [resultTier] = await sql<Partial<UserDAO>[]>`
    UPDATE _users
    SET paid_tier = ${paid_tier}
    WHERE user_sub = ${sub}
    RETURNING paid_tier
  `;
  if (!resultTier) {
    throw new Error('Failed to update paid tier');
  }
  return resultTier.paid_tier;
}
