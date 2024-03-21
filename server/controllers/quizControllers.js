const { v4: uuidv4 } = require("uuid");
const { db } = require("../dbConfig");
const { getObjectUrl } = require("../awsConfig");

const getQuizData = async (req, res) => {
  const { quizId } = req.params;
  const totalQuestions = parseInt(req.params.totalQuestions);
  const beginnerRatio = parseInt(req.params.beginnerRatio);
  const intermediateRatio = parseInt(req.params.intermediateRatio);
  const advancedRatio = parseInt(req.params.advancedRatio);

  try {
    const query =
      "SELECT * FROM quiz_question WHERE quiz_id = ? ORDER BY RAND()";
    db.query(query, [quizId], async (err, rows) => {
      if (err) {
        console.error("Error retrieving questions for quiz: ", err);
        res.status(500).json({ error: "Error retrieving questions for quiz" });
        return;
      }

      const shuffledQuestions = shuffleQuestions(rows);

      const groupedQuestions = groupQuestionsByProficiency(shuffledQuestions);

      const selectedQuestions = selectQuestions(
        groupedQuestions,
        beginnerRatio,
        intermediateRatio,
        advancedRatio,
        totalQuestions
      );
      const quizData = await Promise.all(selectedQuestions.map(async (row) => {
        if (row.imageId !== null) {
          const imageUrl = await getObjectUrl(`.uploads/questions/${row.imageId}.jpg`);
          return {
            questionId: row.question_id,
            questionContent: row.question_content,
            options: [],
            isMCQ: row.isMCQ === 0 ? false : true,
            proficiencyLevel: row.ques_proficiency_level ,
            imageUrl: imageUrl
          };
        } else {
          return {
            questionId: row.question_id,
            questionContent: row.question_content,
            options: [],
            proficiencyLevel: row.ques_proficiency_level ,
            isMCQ: row.isMCQ === 0 ? false : true 
          };
        }
      }));

      
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
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const selectQuestions = (
  groupedQuestions,
  beginnerRatio,
  intermediateRatio,
  advancedRatio,
  totalQuestions
) => {
  const selectedQuestions = [];
  const ratiosSum = beginnerRatio + intermediateRatio + advancedRatio;

  const numBeginnerQuestions = Math.round(
    (beginnerRatio / ratiosSum) * totalQuestions
  );
  const numIntermediateQuestions = Math.round(
    (intermediateRatio / ratiosSum) * totalQuestions
  );
  const numAdvancedQuestions = Math.floor(
    (advancedRatio / ratiosSum) * totalQuestions
  );



  if (groupedQuestions[0]) {
    selectedQuestions.push(
      ...groupedQuestions[0].slice(0, numBeginnerQuestions)
    );
  }
  if (groupedQuestions[1]) {
    selectedQuestions.push(
      ...groupedQuestions[1].slice(0, numIntermediateQuestions)
    );
  }
  if (groupedQuestions[2]) {
    selectedQuestions.push(
      ...groupedQuestions[2].slice(0, numAdvancedQuestions)
    );
  }


  return selectedQuestions;
};

const shuffleQuestions = (questions) => {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions;
};

const groupQuestionsByProficiency = (questions) => {
  const groupedQuestions = {};
  questions.forEach((question) => {
    const proficiencyLevel = question.ques_proficiency_level;
    if (!groupedQuestions[proficiencyLevel]) {
      groupedQuestions[proficiencyLevel] = [];
    }
    groupedQuestions[proficiencyLevel].push(question);
  });
  return groupedQuestions;
};

const submitQuizData = (req, res) => {
  const {
    userId,
    quizId,
    answers,
    timeTaken,
    attemptedQuestions,
    totalQuestions,
  } = req.body;

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
      const optionsQuery =
        "SELECT * FROM options WHERE quiz_id = ? AND question_id = ?";

      quizData.forEach((quiz, index) => {
        db.query(optionsQuery, [quizId, quiz.questionId], (err, optionRows) => {
          if (err) {
            console.error("Error retrieving options for quiz: ", err);
            res
              .status(500)
              .json({ error: "Error retrieving options for quiz" });
            return;
          }

          // Assign options to the current quiz question
          quiz.options = optionRows.map((option) => option.option_value);

          // Query to retrieve correct options for the current question
          const correctOptionQuery =
            "SELECT option_value FROM options WHERE quiz_id = ? AND question_id = ? AND correct_01 = '1'";
          db.query(
            correctOptionQuery,
            [quizId, quiz.questionId],
            (err, correctOptionsRows) => {
              if (err) {
                console.error(
                  "Error retrieving correct options for quiz: ",
                  err
                );
                res
                  .status(500)
                  .json({ error: "Error retrieving correct options for quiz" });
                return;
              }

              // Mapping correct options
              const correctOptions = correctOptionsRows.map(
                (row) => row.option_value
              );
              const userAnswer = answers[quiz.questionId];

              // Checking if there is only one correct option
              if (correctOptions.length === 1) {
                // Comparing user's answer with the correct option
                if (correctOptions[0].toString() === userAnswer) {
                  score += 1;
                }
              } else if (userAnswer !== undefined) {
                // Check if both arrays are equal regardless of order
                const sortedCorrectOptions = correctOptions
                  .slice()
                  .sort()
                  .toString();
                const sortedUserAnswer = userAnswer.slice().sort().toString();
                if (sortedCorrectOptions === sortedUserAnswer) {
                  score += 1;
                }
              }
              // If this is the last question, save the user history and send the score as response
              if (index === quizData.length - 1) {
                const percentage = ((score / totalQuestions) * 100).toFixed(2);
                // Save user history
                const history_record_id = uuidv4(); // Generate history record id
                const date_played = new Date().toISOString().split("T")[0]; // Get current date
                const num_of_questions_attempted = attemptedQuestions; // Total number of questions attempted

                // Insert user history record into database
                const insertUserHistoryQuery =
                  "INSERT INTO user_history (history_record_id, user_id, quiz_id, marks_obtained, date_played, num_of_questions_attempted,total_time_taken_in_sec) VALUES (?, ?, ?, ?, ?, ?,?)";
                db.query(
                  insertUserHistoryQuery,
                  [
                    history_record_id,
                    userId,
                    quizId,
                    percentage,
                    date_played,
                    num_of_questions_attempted,
                    timeTaken,
                  ],
                  (err, result) => {
                    if (err) {
                      console.error("Error inserting user history:", err);
                      res
                        .status(500)
                        .json({ error: "Error inserting user history" });
                      return;
                    }

                    // Update the no_of_times_played counter for the quiz
                    const updateQuizCounterQuery =
                      "UPDATE quiz SET no_of_times_played = no_of_times_played + 1 WHERE quiz_id = ?";
                    db.query(
                      updateQuizCounterQuery,
                      [quizId],
                      (err, result) => {
                        if (err) {
                          console.error("Error updating quiz counter:", err);
                          res
                            .status(500)
                            .json({ error: "Error updating quiz counter" });
                          return;
                        }

                        // Send the score as response
                        res.send({percentage,score});
                      }
                    );
                  }
                );
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

module.exports = { getQuizData, submitQuizData };
