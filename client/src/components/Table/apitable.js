// Import necessary modules
const express = require('express');
const router = express.Router();
const db = require(''); // Import your database connection

// Endpoint to fetch top 5 students
router.get('/top-students', async (req, res) => {
  try {
    // Execute the SQL query to fetch top 5 students from user_history table
    const topStudents = await db.query(`
      SELECT u.name, uh.marks_obtained, uh.date_played, uh.num_of_questions_attempted, uh.total_time_taken_in_sec
      FROM user_history AS uh
      JOIN user AS u ON uh.user_id = u.id
      ORDER BY uh.marks_obtained DESC
      LIMIT 5;
    `);

    res.json(topStudents); // Return the fetched data as JSON response
  } catch (error) {
    console.error('Error fetching top students:', error);
    res.status(500).json({ error: 'Internal server error' }); // Handle errors
  }
});

module.exports = router;