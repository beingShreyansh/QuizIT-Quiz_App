const xlsx = require("xlsx");

const addQuiz = async (req, res) => {
  const { file } = req;
  console.log(file)
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
    const query = `SELECT * FROM  `;
    const rows = [
      {
        userId: 1,
        userName: "Alice",
        quizId: 101,
        category: "Cloud Computing",
        score: 8,
        outOf: 10,
        date: "2024-02-12",
        timeTaken: "00:06:30",
      },
      {
        userId: 1,
        userName: "John Doe",
        quizId: 102,
        category: "Docker",
        score: 7,
        outOf: 10,
        date: "2024-02-10",
        timeTaken: "00:08:45",
      },
      {
        userId: 2,
        userName: "Bob",
        quizId: 101,
        category: "kubernetes",
        score: 9,
        outOf: 10,
        date: "2024-02-11",
        timeTaken: "00:05:20",
      },
      {
        userId: 2,
        userName: "Jane Doe",
        quizId: 102,
        category: "Docker",
        score: 6,
        outOf: 10,
        date: "2024-02-09",
        timeTaken: "00:09:05",
      },
    ];

    res.send(rows);
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quiz history." });
  }
};

const uploadFileToDB = async (quizData) => {
  try {
    for (const quiz of quizData) {
      const quizName = quiz["Quiz Name"];
      const question = quiz["Question"];
      const correctAnswer = quiz["Correct Answer"];
      const options = Object.keys(quiz)
        .filter((key) => key.startsWith("Option"))
        .map((key) => quiz[key]);

      console.log("EXCEL:", quizName, question, correctAnswer, options);
    }
  } catch (error) {
    throw new Error("Error uploading quiz data to DB: " + error.message);
  }
};

module.exports = { addQuiz, getUserQuizHistory };
