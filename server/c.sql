DROP DATABASE quiz_it;
CREATE DATABASE quiz_it;
USE quiz_it;
CREATE TABLE user 
(
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'user'
);

CREATE TABLE quiz
(
  quiz_id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255),
  no_of_questions INT
);

CREATE TABLE quiz_question
(
  question_id INT,
  quiz_id INT,
  question_content VARCHAR(1000),
  PRIMARY KEY (question_id, quiz_id),
  FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id)
);

CREATE TABLE options
(
   option_id INT,
   quiz_id INT,
   question_id INT,
   option_value VARCHAR(255),
   correct_01 CHAR(1),
   PRIMARY KEY (option_id, quiz_id, question_id),
   FOREIGN KEY (quiz_id) REFERENCES quiz(quiz_id),
   FOREIGN KEY (question_id) REFERENCES quiz_question(question_id),
   CHECK (correct_01 IN ("0","1"))
);
