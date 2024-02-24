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

const submitQuizData = async (req, res) => {
  const { quizId } = req.params;
  const { timeTaken, quizData, categoryName, userID } = req.body;

  try {
    console.log("Processing quiz submission...");

    const insertUserHistoryQuery =
      "INSERT INTO user_history (history_record_id, user_id, quiz_id, marks_obtained, date_played, num_of_questions_attempted, total_time_taken_in_sec) VALUES (?, ?, ?, ?, ?, ?, ?)";

    let totalScore = 0;
    const numQuestionsAttempted = quizData.length;

    const promises = quizData.map(async (userResponse) => {
      const { questionId, selectedOptions } = userResponse;

      try {
        console.log(`Processing question ${questionId}...`);

        const getCorrectOptionsQuery = `SELECT option_id FROM options WHERE quiz_id = ? AND question_id = ? AND correct_01 = 1`;

        const [correctOptions] = await db
          .promise()
          .query(getCorrectOptionsQuery, [quizId, questionId]);

        const correctOptionIds = correctOptions.map((row) => row.option_id);

        console.log("Correct options:", correctOptionIds);

        // Check if the user's selected options match the correct options
        const isCorrect =
          correctOptionIds.length === selectedOptions.length &&
          correctOptionIds.every((optionId) =>
            selectedOptions.includes(optionId)
          );

        // If the answer is correct, increment the total score
        if (isCorrect) {
          totalScore += 1;
        }

        console.log(
          `Question ${questionId} processed. Is correct: ${isCorrect}`
        );

        return {
          questionId,
          isCorrect,
        };
      } catch (error) {
        console.error(`Error in processing question ${questionId}:`, error);
        throw error; // Re-throw the error to be caught by the outer catch block
      }
    });

    // Wait for all promises to resolve before inserting into the database
    Promise.all(promises).then(async (results) => {
      console.log(
        "All questions processed. Inserting into the user_history table..."
      );

      // Calculate the date played (assuming it's the current date)
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];

      db.query(
        insertUserHistoryQuery,
        [
          uuidv4(),
          userID,
          quizId,
          totalScore,
          formattedDate,
          numQuestionsAttempted,
          timeTaken,
        ],
        (err) => {
          if (err) {
            console.error(
              "Error inserting quiz data into the user_history table:",
              err
            );
            res.status(500).json({ error: "Error submitting quiz data" });
            return;
          }

          console.log(
            "Quiz data inserted into the user_history table successfully."
          );
          res.status(200).json({
            success: true,
            message: "Quiz data submitted successfully",
            totalScore,
          });
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getQuizData, submitQuizData };
