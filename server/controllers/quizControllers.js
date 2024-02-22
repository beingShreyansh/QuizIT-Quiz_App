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
  try {
    // Query to fetch quiz data from the database
    const query = "SELECT * FROM quiz_table";
    // Execute the query

    // Close the MySQL connection

    // Send the quiz data as a response
    res.send(quizData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getQuizData };
