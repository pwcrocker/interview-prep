import postgres from 'postgres';
import { log, logJson } from './logger';

const {
  PREP_POSTGRES_WRITE_USER,
  PREP_POSTGRES_WRITE_PASSWORD,
  PREP_POSTGRES_HOST,
  PREP_POSTGRES_PORT,
  PREP_POSTGRES_DB,
} = process.env;

const databaseUrl: string = `postgres://${PREP_POSTGRES_WRITE_USER}:${PREP_POSTGRES_WRITE_PASSWORD}@${PREP_POSTGRES_HOST}:${PREP_POSTGRES_PORT}/${PREP_POSTGRES_DB}`;

const sql = postgres(databaseUrl);

export default sql;

// Function to find user by auth subject
export async function findUserBySub(sub: string) {
  log(sub);
  const users = await sql`
    SELECT * FROM _users WHERE sub = ${sub}
  `;
  logJson('users: ', users);
  return users[0]; // Return the first user found (or undefined if not found)
}

// Function to insert a new user into the database
export async function insertUser(sub: string, email: string) {
  const newUser = await sql`
    INSERT INTO _users (sub, email) VALUES (${sub}, ${email})
  `;

  return newUser;
}
