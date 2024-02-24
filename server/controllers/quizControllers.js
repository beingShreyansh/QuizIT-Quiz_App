const { db } = require("../dbConfig");

const quizData = [
  {
    id: 1,
    question: "What is the Fullform of CSS",
    options: ["CSS", "OOPS", "Cascading Style Sheets"],
  },
  {
    id: 2,
    question: "What is the Fullform of HTML",
    options: [
      "HTML",
      "Hyper text markup language",
      "HyperPool Text Markup MOdel lanmguage",
    ],
  },
  {
    id: 3,
    question: "What is the React",
    options: ["HTML", "Frameworrk", "Library"],
  },
];

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
      let isMCQ = true; // Declare isMCQ variable outside the loop

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
                console.log(correctOptionCount);

                if (correctOptionCount > 1) {
                  isMCQ = false; // Update isMCQ based on the query results
                }
              }
              console.log(quizData);
              quiz.options = optionRows.map((option) => option.option_value);

              completedRequests++;

              // Check if all options requests are completed
              if (completedRequests === quizData.length) {
                // Filter quizData to include only questions with more than one option
                const filteredQuizData = quizData.filter(
                  (quiz) => quiz.options.length > 1
                );
                // Send response after filtering
                res.json(filteredQuizData.map((item) => ({ ...item, isMCQ })));
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

module.exports = { getQuizData };

module.exports = { getQuizData };
