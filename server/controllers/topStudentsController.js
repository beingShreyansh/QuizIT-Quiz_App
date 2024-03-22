const { db } = require('../dbConfig');

exports.getTopStudents = async (req, res) => {
  try {
    const query = `
    SELECT 
    u.name,
    AVG(marks_obtained) AS avg_per,
    AVG(uh.total_time_taken_in_sec) AS avg_time_taken,
    DATE(MIN(uh.date_played)) AS first_played_date,
    DATE(MAX(uh.date_played)) AS last_played_date
FROM 
    user u
JOIN 
    user_history uh ON u.id = uh.user_id
GROUP BY 
    uh.user_id
ORDER BY 
    avg_per DESC
LIMIT 5;
  `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error('Error fetching top students:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json(rows);
    });
  } catch (error) {
    console.error('Error fetching top students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getAverageScore = async (req, res) => {
  try {
    const query = `
    SELECT 
    q.quiz_category,
    q.quiz_name,
    AVG(uh.num_of_questions_attempted) AS avg_questions_attempted,
    AVG(uh.marks_obtained) AS avg_marks_obtained
FROM 
    quiz q
LEFT JOIN 
    user_history uh ON q.quiz_id = uh.quiz_id
GROUP BY 
    q.quiz_category,
    q.quiz_name
ORDER BY
    avg_questions_attempted DESC, avg_marks_obtained DESC
LIMIT 5;
    

    `;

    const [rows] = await db.promise().query(query);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching average scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
