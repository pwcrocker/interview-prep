'use server';

import postgres from 'postgres';
import { log } from 'console';
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
    SELECT * FROM _users WHERE sub = ${sub}
  `;
  return users[0];
}

export async function insertUser(sub: string, email: string) {
  const newUser = await sql`
    INSERT INTO _users (sub, email) VALUES (${sub}, ${email})
  `;
  log('Inserting new user');
  return newUser;
}

// TODO types feel like a mess here
// export async function insertQuiz(sub: string, prelimQuiz: PreliminaryQuiz) {
//   const { profession, includedAreas, excludedAreas, exclusiveAreas } = prelimQuiz.attributes;

//   const quizDao = {
//     user_sub: sub,
//     subject_matter: profession.job,
//     difficulty_modifier: profession.experience,
//     included_topics: !includedAreas.length ? null : includedAreas,
//     excluded_topics: !excludedAreas.length ? null : excludedAreas,
//     exclusive_topics: !exclusiveAreas.length ? null : exclusiveAreas,
//   };

// }

export async function updateUserTokensReturningTokens(userSub: string, tokenChange: number) {
  const user = await sql`
    UPDATE _users
    SET tokens = tokens + ${tokenChange}
    WHERE sub = ${userSub}
    RETURNING tokens
  `;
  log(`Updated tokens: ${user[0]?.tokens}`);
  return user[0].tokens;
}
