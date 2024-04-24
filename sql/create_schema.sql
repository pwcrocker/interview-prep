-- https://wiki.postgresql.org/wiki/Don't_Do_This
-- assumes psql -v db_name and db_user (like init-db.sh)

-----------------------------------------
--------- BEGIN INIT SECTION ------------
-----------------------------------------

CREATE DATABASE :db_name;
CREATE ROLE :db_user WITH LOGIN PASSWORD :'db_pwd';
ALTER DATABASE :db_name OWNER TO :db_user;
\c :db_name :db_user
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------
---------- END INIT SECTION -------------
-----------------------------------------

-----------------------------------------
-------- BEGIN SCHEMA SECTION -----------
-----------------------------------------

CREATE TABLE _users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_sub TEXT UNIQUE NOT NULL,
  username TEXT,
  email TEXT UNIQUE NOT NULL,
  tokens SMALLINT DEFAULT 0,
  is_disabled BOOLEAN NOT NULL DEFAULT FALSE,
  num_times_rate_limited INT NOT NULL DEFAULT 0,
  -- these timestamps are updated via trigger
  last_quiz_creation TIMESTAMP WITH TIME ZONE,
  last_quiz_grading TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  question_topic TEXT
);

CREATE TABLE quizzes (
  quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_sub UUID REFERENCES _users(user_sub),
  subject_area TEXT NOT NULL,
  difficulty_modifier TEXT,
  included_topics TEXT,
  excluded_topics TEXT,
  exclusive_topics TEXT,
  is_graded BOOLEAN NOT NULL DEFAULT FALSE
);

-- setting this table up for potential many-to-many quiz to questions
--   necessary if questions are reused instead of fetched every time
CREATE TABLE quiz_questions (
  quiz_id UUID REFERENCES quizzes(quiz_id),
  question_id UUID REFERENCES questions(question_id)
);

CREATE TABLE user_answers (
  answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_sub UUID REFERENCES _users(user_sub),
  question_id UUID REFERENCES questions(question_id),
  user_answer TEXT NOT NULL,
  ai_summary_analysis SMALLINT,
  ai_detailed_analysis TEXT
);

-----------------------------------------
--------- END SCHEMA SECTION ------------
-----------------------------------------

-----------------------------------------
-------- BEGIN TRIGGERS SECTION ---------
-----------------------------------------

-- deal with _users.modified_at

CREATE OR REPLACE FUNCTION fn_update_user_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = CURRENT_TIMESTAMP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_update_user_modified
BEFORE UPDATE ON _users
FOR EACH ROW
EXECUTE FUNCTION fn_update_user_modified_at();

-- deal with _users.last_quiz_creation

CREATE OR REPLACE FUNCTION fn_update_last_quiz_creation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE _users
  SET last_quiz_creation = CURRENT_TIMESTAMP
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_mark_quiz_creation
BEFORE INSERT ON quizzes
FOR EACH ROW
EXECUTE FUNCTION fn_update_last_quiz_creation();

-- deal with _users.last_quiz_grading

CREATE OR REPLACE FUNCTION fn_update_last_quiz_grading()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE _users
  SET last_quiz_grading = CURRENT_TIMESTAMP
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_mark_quiz_grading
BEFORE UPDATE OF is_graded ON quizzes
FOR EACH ROW
WHEN (NEW.is_graded = TRUE AND OLD.is_graded = FALSE)
EXECUTE FUNCTION fn_update_last_quiz_grading();

-----------------------------------------
--------- END TRIGGERS SECTION ----------
-----------------------------------------


-----------------------------------------
--------- BEGIN VIEWS SECTION -----------
-----------------------------------------

-- all quizzes and questions joined

CREATE VIEW view_all_quiz_questions AS
SELECT qz.quiz_id, qz.subject_area, q.question_id, q.question, q.question_topic
FROM questions q
JOIN quiz_questions qq ON q.question_id = qq.question_id
JOIN quizzes qz ON qq.quiz_id = qz.quiz_id;

-----------------------------------------
---------- END VIEWS SECTION ------------
-----------------------------------------