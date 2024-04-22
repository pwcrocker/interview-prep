\c :db_name :db_user

BEGIN;

INSERT INTO _users(sub, email)
VALUES ('auth0|mockuser1', 'mockuser1@mail.com');

INSERT INTO quizzes(user_id, subject_area)
VALUES (
  (SELECT user_id FROM _users WHERE sub = 'auth0|mockuser1'),
  'Mock subject area 1'
);

INSERT INTO questions(question, question_topic)
VALUES ('Mock question 1', 'Mock question topic 1');

INSERT INTO quiz_questions(quiz_id, question_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 1'),
  (SELECT question_id FROM questions WHERE question = 'Mock question 1')
);

INSERT INTO questions(question, question_topic)
VALUES ('Mock question 2', 'Mock question topic 2')
RETURNING question_id;

INSERT INTO quiz_questions(quiz_id, question_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 1'),
  (SELECT question_id FROM questions WHERE question = 'Mock question 2')
);

COMMIT;

BEGIN;

INSERT INTO quizzes(user_id, subject_area)
VALUES (
  (SELECT user_id FROM _users WHERE sub = 'auth0|mockuser1'),
  'Mock subject area 2'
);

INSERT INTO questions(question, question_topic)
VALUES ('Mock question 3', 'Mock question topic 3');

INSERT INTO quiz_questions(quiz_id, question_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 2'),
  (SELECT question_id FROM questions WHERE question = 'Mock question 3')
);

INSERT INTO questions(question, question_topic)
VALUES ('Mock question 4', 'Mock question topic 4')
RETURNING question_id;

INSERT INTO quiz_questions(quiz_id, question_id)
VALUES (
  (SELECT quiz_id FROM quizzes WHERE subject_area = 'Mock subject area 2'),
  (SELECT question_id FROM questions WHERE question = 'Mock question 4')
);

COMMIT;
