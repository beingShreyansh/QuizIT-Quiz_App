const xlsx = require("xlsx");
const { db } = require("../dbConfig");

const rows = [
  {
    category: "IT",
    score: 85,
    outOf: 100,
    date: "2024-02-15",
    timeTaken: "45 minutes",
  },
  {
    category: "Cloud",
    score: 90,
    outOf: 100,
    date: "2024-02-16",
    timeTaken: "40 minutes",
  },
  {
    category: "Docker",
    score: 95,
    outOf: 100,
    date: "2024-02-17",
    timeTaken: "50 minutes",
  },
  {
    category: "IT",
    score: 80,
    outOf: 100,
    date: "2024-02-18",
    timeTaken: "50 minutes",
  },
  {
    category: "Cloud",
    score: 85,
    outOf: 100,
    date: "2024-02-19",
    timeTaken: "55 minutes",
  },
  {
    category: "Docker",
    score: 90,
    outOf: 100,
    date: "2024-02-20",
    timeTaken: "45 minutes",
  },
  {
    category: "IT",
    score: 75,
    outOf: 100,
    date: "2024-02-21",
    timeTaken: "60 minutes",
  },
  {
    category: "Cloud",
    score: 95,
    outOf: 100,
    date: "2024-02-22",
    timeTaken: "35 minutes",
  },
  {
    category: "Docker",
    score: 92,
    outOf: 100,
    date: "2024-02-23",
    timeTaken: "48 minutes",
  },
  {
    category: "IT",
    score: 88,
    outOf: 100,
    date: "2024-02-24",
    timeTaken: "42 minutes",
  },
];

const getCategories = async (req, res) => {
  try {
    const query = `SELECT quiz_name, quiz_id FROM quiz;`; // Modified query to select both id and quiz_name
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching categories: ", err);
        res
          .status(500)
          .json({ error: "An error occurred while fetching categories." });
        return;
      }
      const categories = JSON.parse(JSON.stringify(rows)); // Parse rows to JSON

      res.json(categories);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories." });
  }
};

const getUserQuizHistory = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const query = `
    SELECT q.quiz_name, uh.marks_obtained, uh.date_played, uh.num_of_questions_attempted, uh.total_time_taken_in_sec
    FROM quiz AS q, user_history AS uh
    WHERE q.quiz_id = uh.quiz_id AND uh.user_id = ?;
    `;

    db.query(query, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching the user history: ", err);
        res.status(500).json({
          error: "An error occurred while fetching the user history.",
        });
        return;
      }
      const userHistory = JSON.parse(JSON.stringify(rows));
      console.log(userHistory);
      res.send(userHistory);
    });
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quiz history." });
  }
};

module.exports = { getUserQuizHistory, getCategories };
