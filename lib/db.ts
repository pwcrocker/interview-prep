import postgres from 'postgres';

const {
  PREP_POSTGRES_USER,
  PREP_POSTGRES_PASSWORD,
  PREP_POSTGRES_HOST,
  PREP_POSTGRES_PORT,
  PREP_POSTGRES_DB,
} = process.env;
const databaseUrl: string = `postgres://${PREP_POSTGRES_USER}:${PREP_POSTGRES_PASSWORD}@${PREP_POSTGRES_HOST}:${PREP_POSTGRES_PORT}/${PREP_POSTGRES_DB}`;

const sql = postgres(databaseUrl);

export default sql;
