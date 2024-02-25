const { v4: uuidv4 } = require("uuid");
const { db } = require("../dbConfig");

const getQuizData = (req, res) => {
  const { quizId } = req.params;
  try {
    const query = "SELECT * FROM quiz_question WHERE quiz_id = ?";

    db.query(query, [quizId], (err, rows) => {
      if (err) {
        console.error("Error retrieving questions for quiz: ", err);
        res.status(500).json({ error: "Error retrieving questions for quiz" });
        return;
      }

      const quizData = rows.map((row) => {
        return {
          questionId: row.question_id,
          questionContent: row.question_content,
          options: [],
        };
      });
      const optionsQuery =
        "SELECT * FROM options WHERE quiz_id = ? AND question_id = ?";

      let completedRequests = 0;

      quizData.forEach((quiz, index) => {
        db.query(optionsQuery, [quizId, quiz.questionId], (err, optionRows) => {
          if (err) {
            console.error("Error retrieving options for quiz: ", err);
            res
              .status(500)
              .json({ error: "Error retrieving options for quiz" });
            return;
          }

          const optionCountQuery = `SELECT COUNT(*) AS correct_cnt FROM quiz_question AS qq, options AS o WHERE qq.quiz_id = o.quiz_id AND qq.question_id = o.question_id AND qq.question_id = ? AND correct_01 = "1";`;

          db.query(
            optionCountQuery,
            [quiz.questionId],
            (err, correctAnswerCount) => {
              if (err) {
                console.error("Error retrieving options for quiz: ", err);
                res
                  .status(500)
                  .json({ error: "Error retrieving options for quiz" });
                return;
              } else {
                const answerCount = JSON.parse(
                  JSON.stringify(correctAnswerCount)
                );
                const correctOptionCount = answerCount[0].correct_cnt;

                let questionType = "MCQ"; // Assume by default it's a MCQ
                if (correctOptionCount > 1) {
                  questionType = "MSQ"; // If correctOptionCount is more than 1, it's MSQ
                }
                quiz.questionType = questionType; // Add questionType property to the quiz

                const updatedQuizData = quizData.map((data) => ({
                  ...data,
                  isMCQ: questionType === "MCQ",
                  questionType,
                }));
              }

              quiz.options = optionRows.map((option) => option.option_value);

              completedRequests++;

              // Check if all options requests are completed
              if (completedRequests === quizData.length) {
                // Filter quizData to include only questions with more than one option
                const filteredQuizData = quizData.filter(
                  (quiz) => quiz.options.length > 1
                );
                // Send response after filtering
                res.json(filteredQuizData);
              }
            }
          );
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const submitQuizData = (req, res) => {
  const { userId, quizId, answers,timeTaken,attemptedQuestions } = req.body;
  
  let score = 0;

  try {
    // Query to retrieve quiz questions
    const questionQuery = "SELECT * FROM quiz_question WHERE quiz_id = ?";
    
    db.query(questionQuery, [quizId], (err, rows) => {
      if (err) {
        console.error("Error retrieving questions for quiz: ", err);
        res.status(500).json({ error: "Error retrieving questions for quiz" });
        return;
      }

      // Mapping quiz questions
      const quizData = rows.map((row) => ({
        questionId: row.question_id,
        questionContent: row.question_content,
        options: [],
      }));

      // Query to retrieve options for each question
      const optionsQuery = "SELECT * FROM options WHERE quiz_id = ? AND question_id = ?";

      quizData.forEach((quiz, index) => {
        db.query(optionsQuery, [quizId, quiz.questionId], (err, optionRows) => {
          if (err) {
            console.error("Error retrieving options for quiz: ", err);
            res.status(500).json({ error: "Error retrieving options for quiz" });
            return;
          }

          // Assign options to the current quiz question
          quiz.options = optionRows.map((option) => option.option_value);

          // Query to retrieve correct options for the current question
          const correctOptionQuery = "SELECT option_value FROM options WHERE quiz_id = ? AND question_id = ? AND correct_01 = '1'";
          db.query(correctOptionQuery, [quizId, quiz.questionId], (err, correctOptionsRows) => {
            if (err) {
              console.error("Error retrieving correct options for quiz: ", err);
              res.status(500).json({ error: "Error retrieving correct options for quiz" });
              return;
            }

            // Mapping correct options
            const correctOptions = correctOptionsRows.map((row) => row.option_value);
            const userAnswer = answers[quiz.questionId];

            // Checking if there is only one correct option
            if (correctOptions.length === 1) {
              // Comparing user's answer with the correct option
              if (correctOptions[0].toString() === userAnswer) {
                score += 1;
              }
            } else if (userAnswer !== undefined) {
              // Check if both arrays are equal regardless of order
              const sortedCorrectOptions = correctOptions.slice().sort().toString();
              const sortedUserAnswer = userAnswer.slice().sort().toString();
              if (sortedCorrectOptions === sortedUserAnswer) {
                score += 1;
              }
            } 
            
            // If this is the last question, save the user history and send the score as response
            if (index === quizData.length - 1) {
              
              // Save user history
              const history_record_id = uuidv4(); // Generate history record id
              const date_played = new Date().toISOString().split('T')[0]; // Get current date
              const num_of_questions_attempted = attemptedQuestions; // Total number of questions attempted
              
              // Insert user history record into database
              const insertUserHistoryQuery = "INSERT INTO user_history (history_record_id, user_id, quiz_id, marks_obtained, date_played, num_of_questions_attempted,total_time_taken_in_sec) VALUES (?, ?, ?, ?, ?, ?,?)";
              db.query(insertUserHistoryQuery, [history_record_id, userId, quizId, score, date_played, num_of_questions_attempted,timeTaken], (err, result) => {
                if (err) {
                  console.error("Error inserting user history:", err);
                  res.status(500).json({ error: "Error inserting user history" });
                  return;
                }
                
                // Send the score as response
                res.json(score);
              });
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

    
module.exports = { getQuizData, submitQuizData };
