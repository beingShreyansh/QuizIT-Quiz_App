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
  console.log(quizId);
  try {
    // Query to fetch quiz data from the database
    const query = "SELECT * FROM Quiz_Question WHERE quiz_id = ?";
    // Execute the query
    db.query(query, [quizId], (err, rows) => {
      if (err) {
        console.error("Error retrieving questions for quiz: ", err);
        return;
      }
      console.log(`Questions for quiz with ID ${quizId}:`);
      console.log(rows);
    });
    // Send the quiz data as a response
    res.send(quizData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getQuizData };
