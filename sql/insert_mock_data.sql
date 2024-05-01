\c :db_name :db_user

-- load a user and a quiz w a couple of ques

BEGIN;

INSERT INTO _users(user_sub, email)
VALUES ('auth0|mockuser1', 'mockuser1@mail.com');

INSERT INTO quizzes(user_sub, subject_area, quiz_type, difficulty)
VALUES (
  'auth0|mockuser1',
  'Mock subject area 1',
  'Profession',
  '3-5 years'
);

INSERT INTO questions(ques_text, ques_topic)
VALUES ('Mock question 1', 'Mock question topic 1');

INSERT INTO quiz_questions(quiz_id, ques_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 1'),
  (SELECT ques_id FROM questions WHERE ques_text = 'Mock question 1')
);

INSERT INTO questions(ques_text, ques_topic)
VALUES ('Mock question 2', 'Mock question topic 2')
RETURNING ques_id;

INSERT INTO quiz_questions(quiz_id, ques_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 1'),
  (SELECT ques_id FROM questions WHERE ques_text = 'Mock question 2')
);

COMMIT;

BEGIN;

-- load second quiz w a couple of ques

INSERT INTO quizzes(user_sub, subject_area, quiz_type, difficulty)
VALUES (
  'auth0|mockuser1',
  'Mock subject area 2',
  'Profession',
  '3-5 years'
);

INSERT INTO questions(ques_text, ques_topic)
VALUES ('Mock question 3', 'Mock question topic 3');

INSERT INTO quiz_questions(quiz_id, ques_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 2'),
  (SELECT ques_id FROM questions WHERE ques_text = 'Mock question 3')
);

INSERT INTO questions(ques_text, ques_topic)
VALUES ('Mock question 4', 'Mock question topic 4')
RETURNING ques_id;

INSERT INTO quiz_questions(quiz_id, ques_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 2'),
  (SELECT ques_id FROM questions WHERE ques_text = 'Mock question 4')
);

COMMIT;
