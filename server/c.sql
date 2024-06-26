DROP DATABASE quiz_it;
CREATE DATABASE quiz_it;
USE quiz_it;

CREATE TABLE user 
(
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'user',
  imageId VARCHAR(1500) DEFAULT 'profile-default',
  access_token VARCHAR(255)
);

CREATE TABLE quiz
(
  quiz_id CHAR(36) PRIMARY KEY,
  quiz_category VARCHAR(255) NOT NULL,
  quiz_name VARCHAR(255) NOT NULL UNIQUE,
  no_of_questions INT,
  no_of_times_played INT
);

/*
  ques_proficiency_level field:
    0 --> beginner question
    1 --> intermediate question
    2 --> advanced question

  ques_type field:
    0 --> general
    1 --> scenario

  ISmcq field:
    0 --> False
    1 --> True
*/


CREATE TABLE quiz_question (
    question_id CHAR(36),
    quiz_id CHAR(36),
    question_content VARCHAR(1000),
    imageId VARCHAR(1500),
    ques_proficiency_level CHAR(1),
    ques_type CHAR(2),
    isMCQ CHAR(1),
    PRIMARY KEY (question_id, quiz_id),
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id),
    CHECK (ques_proficiency_level IN ('0', '1', '2'))
    CHECK (isMCQ IN ('0', '1'))
);

/*
  correct_01:
    0 --> it is a correct option
    1 --> it is not a correct option
*/
CREATE TABLE options
(
   option_id CHAR(36),
   quiz_id CHAR(36),
   question_id CHAR(36),
   option_value VARCHAR(255),
   correct_01 CHAR(1),
   PRIMARY KEY (option_id, quiz_id, question_id),
   FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id),
   FOREIGN KEY (question_id) REFERENCES quiz_question(question_id),
   CHECK (correct_01 IN ("0","1"))
);

CREATE TABLE user_history 
(
    history_record_id CHAR(36),
    user_id CHAR(36),
    quiz_id CHAR(36),
    marks_obtained INT,
    date_played DATE,
    num_of_questions_attempted INT,
    total_time_taken_in_sec INT,
    PRIMARY KEY (user_id, history_record_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);

CREATE VIEW question_distribution_cnt
AS 
SELECT qq.ques_proficiency_level, COUNT(*) AS number_of_ques
FROM quiz_question AS qq
GROUP BY qq.ques_proficiency_level; 


/* TO get all quiz names */
SELECT quiz_name
FROM quiz;

/* To get the complete history of user on basis of user_id */
SELECT q.quiz_name, uh.marks_obtained, uh.date_played, uh.num_of_questions_attempted, uh.total_time_taken_in_sec
FROM quiz AS q, user_history AS uh
WHERE q.quiz_id = uh.quiz_id AND uh.user_id = (INPTID);

/* To get the grouped history of a user */
SELECT u.name, COUNT(*) AS no_of_times_played, AVG(uh.marks_obtained) AS avg_score, MAX(uh.date_played) as last_date_played
FROM user_history AS uh, user AS u
WHERE uh.user_id = u.id
GROUP BY uh.user_id;

/*generate quiz_id - 1*/

INSERT INTO quiz VALUES("quiz_id", "quiz_name", 5); 

/*generate ques_id - mult.*/

INSERT INTO quiz_question VALUES("ques_id", "quiz_id", "question_content");

/* generate option_id - mult*/

INSERT INTO options VALUES("option_id", "quiz_id", "question_id", "optioN_value", "1");

/**/
SELECT COUNT(*) AS correct_cnt
FROM quiz_question AS qq, options AS o
WHERE qq.quiz_id = o.quiz_id AND qq.question_id = o.question_id AND qq.question_id = "c200221c-316c-4886-80e7-db482ff912d9" AND correct_01 = "1";

ALTER TABLE user_history
ADD COLUMN no_of_questions_shown INT;