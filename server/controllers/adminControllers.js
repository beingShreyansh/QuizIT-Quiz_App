const xlsx = require("xlsx");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../dbConfig");

const addQuiz = async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const quizData = xlsx.utils.sheet_to_json(worksheet);

    await uploadFileToDB(quizData);

    res.send("Quiz data uploaded successfully.");
  } catch (error) {
    console.error("Error uploading quiz data:", error);
    res.status(500).send("An error occurred while uploading quiz data.");
  }
};

const getUserQuizHistory = async (req, res) => {
  const userId = req.params.userId;
  try {
    const query = `SELECT u.name, COUNT(*) AS no_of_times_played, AVG(uh.marks_obtained) AS avg_score, MAX(uh.date_played) as last_date_played
    FROM user_history AS uh, user AS u
    WHERE uh.user_id = u.id
    AND u.id = ?
    GROUP BY uh.user_id; `;

    db.query(query, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching user quiz history:", err);
        res.status(500).json({
          error: "An error occurred while fetching user quiz history.",
        });
        return;
      }

      res.send(rows);
    });
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quiz history." });
  }
};

const uploadFileToDB = async (quizData) => {
  try {
    const quizId = uuidv4();
    for (const quiz of quizData) {
      const quizName = quiz["Quiz Name"] || "HTML";
      const questions = [];

      // Iterate over each row to extract questions and options
      for (let i = 0; i < quizData.length; i++) {
        const questionContent = quizData[i]["question"];
        const options = Object.keys(quizData[i])
          .filter((key) => key.startsWith("option_"))
          .map((key) => quizData[i][key]);
        const correctAnswers = (quizData[i]["correct_answer"] || "").toString().split(",").map(Number);

        questions.push({ content: questionContent, options, correctAnswers });
      }

      // Insert quiz data
      const quizInsertQuery =
        "INSERT INTO quiz (quiz_id, quiz_name, no_of_questions) VALUES (?, ?, ?)";
      await executeQuery(quizInsertQuery, [quizId, quizName, questions.length]);

      // Insert question and options data
      for (const question of questions) {
        const questionId = uuidv4();

        // Insert question data
        const questionInsertQuery =
          "INSERT INTO quiz_question (quiz_id, question_id, question_content) VALUES (?, ?, ?)";
        await executeQuery(questionInsertQuery, [
          quizId,
          questionId,
          question.content,
        ]);

        for (let i = 0; i < question.options.length; i++) {
          const optionValue = question.options[i];
          const isCorrect = question.correctAnswers.includes(i + 1) ? 1 : 0;

          const optionInsertQuery =
            "INSERT INTO options (option_id, quiz_id, question_id, option_value, correct_01) VALUES (?, ?, ?, ?, ?)";
          await executeQuery(optionInsertQuery, [
            uuidv4(),
            quizId,
            questionId,
            optionValue,
            isCorrect,
          ]);
        }
      }

      console.log("Quiz uploaded:", quizName);
    }
  } catch (error) {
    throw new Error("Error uploading quiz data to DB: " + error.message);
  }
};



const executeQuery = async (query, params) => {
  try {
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    throw new Error("Error executing SQL query: " + error.message);
  }
};
module.exports = { addQuiz, getUserQuizHistory };

