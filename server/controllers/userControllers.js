const xlsx = require("xlsx");

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

/// http://localhost:3001/user/getHistory/12
const getUserQuizHistory = async (req, res) => {
  const userId = req.params.id;
  try {
    const query = `SELECT * FROM  `;

    res.send(rows);
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quiz history." });
  }
};

module.exports = { getUserQuizHistory };
