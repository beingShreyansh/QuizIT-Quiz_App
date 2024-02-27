const xlsx = require("xlsx");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../dbConfig");

const addQuiz = async (req, res) => {
  const {file} = req;
  const quizName = req.body.quizName;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Check if quizName already exists
    const existingQuiz = await getQuizByName(quizName);
    if (existingQuiz) {
      return res.status(410).send("Quiz name already exists.");
    }

    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const quizData = xlsx.utils.sheet_to_json(worksheet);

    await uploadFileToDB(quizData, quizName);

    res.send("Quiz data uploaded successfully.");
  } catch (error) {
    console.error("Error uploading quiz data:", error);
    res.status(500).send("An error occurred while uploading quiz data.");
  }
};
const getUserQuizHistory = async (req, res) => {
  try {
    const query = `
      SELECT u.id AS user_id, u.name, COUNT(*) AS no_of_times_played, AVG(uh.marks_obtained) AS avg_score, MAX(uh.date_played) as last_date_played
      FROM user_history AS uh
      JOIN user AS u ON uh.user_id = u.id
      GROUP BY uh.user_id;
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching user quiz history:", err);
        return res.status(500).json({
          error: "An error occurred while fetching user quiz history.",
        });
      }

      res.json(rows);
    });
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res.status(500).json({ error: "An error occurred while fetching user quiz history." });
  }
};


const uploadFileToDB = async (quizData, quizName) => {
  try {
    const quizId = uuidv4();
    for (const quiz of quizData) {
      const questions = [];

      // Iterate over each row to extract questions and options
      for (let i = 0; i < quizData.length; i++) {
        const questionContent = quizData[i]["question"];
        const options = Object.keys(quizData[i])
          .filter((key) => key.startsWith("option_"))
          .map((key) => quizData[i][key]);
        const correctAnswers = (quizData[i]["correct_answer"] || "")
          .toString()
          .split(",")
          .map(Number);

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
    }
  } catch (error) {
    throw new Error("Error uploading quiz data to DB: " + error.message);
  }
};

const getQuizByName = async (quizName) => {
  return new Promise((resolve, reject) => {
    // Prepare the SQL query
    const query = "SELECT * FROM quiz WHERE quiz_name = ?";
    // Execute the query
    db.query(query, [quizName], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      // If a quiz with the same name exists, return the quiz object
      if (results.length > 0) {
        resolve(results[0]); // Assuming quiz_name is unique, so only one result is expected
      } else {
        resolve(null); // If no quiz with the same name exists, return null
      }
    });
  });
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
