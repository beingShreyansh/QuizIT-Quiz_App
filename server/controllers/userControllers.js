const xlsx = require("xlsx");
const { db } = require("../dbConfig");
const User = require("../models/User");
const { getObjectUrl } = require("../awsConfig");

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
    DATE_FORMAT(uh.date_played, '%d-%m-%Y') AS date_played, 
    uh.num_of_questions_attempted, uh.total_time_taken_in_sec,
    uh.no_of_questions_shown AS total_questions
    FROM quiz AS q
    INNER JOIN user_history AS uh ON q.quiz_id = uh.quiz_id
    WHERE uh.user_id = ?
    ORDER BY uh.date_played DESC;

    `;

    const userHistory = await new Promise((resolve, reject) => {
      db.query(query, [userId], (err, rows) => {
        if (err) {
          console.error("Error fetching the user history: ", err);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });

    res.send(userHistory);
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

    db.query(query, [userId], async (err, rows) => {
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
      const imageUrl = await getObjectUrl(
        `.uploads/users/${userDetails.imageId}`
      );
      userDetails.imageUrl = imageUrl;
      delete userDetails.imageId;

      res.json(userDetails);
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      error: "An error occurred while fetching user details.",
    });
  }
};

module.exports = { getUserQuizHistory, getCategories, getUserDetails };
