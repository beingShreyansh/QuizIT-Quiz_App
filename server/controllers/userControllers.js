const xlsx = require("xlsx");
const { db } = require("../dbConfig");
const User = require("../models/User");


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
  try {
    const query = `
      SELECT q.quiz_name, uh.marks_obtained, 
      DATE_FORMAT(uh.date_played, '%d-%m-%Y') as date_played, 
      uh.num_of_questions_attempted, uh.total_time_taken_in_sec
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
      res.send(userHistory);
    });
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quiz history." });
  }
};
const getUserDetails = async (req, res) => {
  const userId = req.params.id;
  try {
    const query = `
      SELECT name, email, imageId
      FROM user
      WHERE id = ?;
    `;

    db.query(query, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching user details: ", err);
        res.status(500).json({
          error: "An error occurred while fetching user details.",
        });
        return;
      }
      if (rows.length === 0) {
        res.status(404).json({
          error: "User not found.",
        });
        return;
      }

      const userDetails = JSON.parse(JSON.stringify(rows[0]));
      res.json(userDetails);
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      error: "An error occurred while fetching user details.",
    });
  }
};



module.exports = { getUserQuizHistory, getCategories,getUserDetails };
