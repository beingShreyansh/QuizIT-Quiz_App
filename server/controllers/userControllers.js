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
    const query = `SELECT DISTINCT category FROM quiz; `;
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error  to fetch the user history: ", err);
        return;
      }
      console.log("Categories");
      console.log(rows);
    });

    res.send(rows);
  } catch (error) {
    console.error("Error fetching Categories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching Categories." });
  }
};

const getUserQuizHistory = async (req, res) => {
  const userId = req.params.id;
  try {
    const query = `
    SELECT
        U.full_name,
        P.date_played,
        Q.quiz_name,
        Q.category,
        P.marked_obtained,
        P.num_of_questions_attempted,
        P.no_of_marked_attempted
    FROM
        Plays P
    JOIN
        User U ON P.user_id = U.user_id
    JOIN
        Quiz Q ON P.quiz_id = Q.quiz_id
    WHERE
        U.user_id = ?
    ORDER BY
        P.date_played DESC
`;
    db.query(query, [userId], (err, rows) => {
      if (err) {
        console.error("Error  to fetch the user history: ", err);
        return;
      }
      console.log("Users history for user with ID ${userId}:");
      console.log(rows);
    });

    res.send(rows);
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quiz history." });
  }
};

module.exports = { getUserQuizHistory, getCategories };
