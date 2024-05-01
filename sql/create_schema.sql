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
  paid_tier SMALLINT DEFAULT 0,
  is_disabled BOOLEAN NOT NULL DEFAULT FALSE,
  num_times_rate_limited INT NOT NULL DEFAULT 0,
  -- these timestamps are updated via trigger
  last_quiz_creation TIMESTAMP WITH TIME ZONE,
  last_quiz_grading TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  ques_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ques_text TEXT NOT NULL,
  ques_topic TEXT NOT NULL
);

CREATE TABLE quizzes (
  quiz_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_sub TEXT REFERENCES _users(user_sub),
  quiz_type TEXT NOT NULL,
  subject_area TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  included_topics TEXT,
  excluded_topics TEXT,
  exclusive_topics TEXT,
  is_graded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- setting this table up for potential many-to-many quiz to questions
--   necessary if questions are reused instead of fetched every time
CREATE TABLE quiz_questions (
  quiz_id UUID REFERENCES quizzes(quiz_id),
  ques_id UUID REFERENCES questions(ques_id)
);

CREATE TABLE user_answers (
  answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_sub TEXT REFERENCES _users(user_sub),
  ques_id UUID REFERENCES questions(ques_id),
  user_answer TEXT NOT NULL,
  summary_analysis SMALLINT,
  detailed_analysis TEXT
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

CREATE OR REPLACE FUNCTION fn_update_user_last_quiz_creation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE _users
  SET last_quiz_creation = CURRENT_TIMESTAMP
  WHERE user_sub = NEW.user_sub;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_mark_user_quiz_creation
BEFORE INSERT ON quizzes
FOR EACH ROW
EXECUTE FUNCTION fn_update_user_last_quiz_creation();

-- deal with _users.last_quiz_grading

CREATE OR REPLACE FUNCTION fn_update_last_quiz_grading()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE _users
  SET last_quiz_grading = CURRENT_TIMESTAMP
  WHERE user_sub = NEW.user_sub;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- this sucks
-- CREATE TRIGGER trig_mark_quiz_grading
-- BEFORE UPDATE OF is_graded ON quizzes
-- FOR EACH ROW
-- WHEN (NEW.is_graded = TRUE AND OLD.is_graded = FALSE)
-- EXECUTE FUNCTION fn_update_last_quiz_grading();

-----------------------------------------
--------- END TRIGGERS SECTION ----------
-----------------------------------------


-----------------------------------------
---------- BEGIN TVF SECTION ------------
-----------------------------------------

-- all questions returned for a given quiz id

-- CREATE FUNCTION get_questions_for_quiz_id(p_quiz_id UUID)
-- RETURNS TABLE (question_id UUID, question TEXT, question_topic TEXT) AS
-- $$
-- SELECT ques.question, ques.question_topic
-- FROM questions ques
-- JOIN quiz_questions qq ON ques.question_id = qq.question_id
-- WHERE qq.quiz_id = p_quiz_id;
-- $$
-- LANGUAGE sql VOLATILE;

CREATE FUNCTION get_quiz_overviews_by_user(p_user_sub TEXT)
RETURNS TABLE(
  quiz_id UUID,
  created_at TIMESTAMP,
  subject_area TEXT,
  difficulty TEXT,
  total_answers SMALLINT,
  "great" SMALLINT,
  "good" SMALLINT,
  "average" SMALLINT,
  "needs_improvement" SMALLINT,
  "irrelevant" SMALLINT,
  topics TEXT[]
  ) AS
$$                
SELECT qz.quiz_id, qz.created_at, qz.subject_area, qz.difficulty,
  COUNT(*) as total_answers,
  COUNT(CASE WHEN ua.summary_analysis = 5 THEN 1 END) as "great",
  COUNT(CASE WHEN ua.summary_analysis = 4 THEN 1 END) as "good",
  COUNT(CASE WHEN ua.summary_analysis = 3 THEN 1 END) as "average",
  COUNT(CASE WHEN ua.summary_analysis = 2 THEN 1 END) as "needs_improvement",
  COUNT(CASE WHEN ua.summary_analysis = 1 THEN 1 END) as "irrelevant",
  ARRAY_AGG(DISTINCT ques.ques_topic) as topics 
FROM quizzes as qz JOIN quiz_questions as qq ON qz.quiz_id = qq.quiz_id
JOIN questions ques ON ques.ques_id = qq.ques_id
JOIN user_answers as ua ON qq.ques_id = ua.ques_id
WHERE qz.user_sub = p_user_sub
GROUP BY qz.quiz_id
ORDER BY qz.created_at;
$$                    
LANGUAGE sql VOLATILE;

-----------------------------------------
----------- END TVF SECTION -------------
-----------------------------------------