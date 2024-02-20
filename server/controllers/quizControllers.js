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
];

// Route to fetch quiz data
const getQuizData = (req, res) => {
  res.json(quizData);
};

module.exports = { getQuizData };
