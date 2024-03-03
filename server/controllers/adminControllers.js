const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../dbConfig');

const addQuiz = async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Check if quizName already exists

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const quizData = xlsx.utils.sheet_to_json(worksheet);

    await uploadFileToDB(quizData);

    res.send('Quiz data uploaded successfully.');
  } catch (error) {
    console.error('Error uploading quiz data:', error);
    res.status(500).send('An error occurred while uploading quiz data.');
  }
};
const getUserQuizHistory = async (req, res) => {
  try {
    const query = `
      SELECT u.id AS user_id, u.name, COUNT(*) AS no_of_times_played, AVG(uh.marks_obtained) AS avg_score, MAX(uh.date_played) as last_date_played
      FROM user_history AS uh
      JOIN user AS u ON uh.user_id = u.id
      GROUP BY uh.user_id;
    `;

    db.query(query, (err, rows) => {
      if (err) {
        console.error('Error fetching user quiz history:', err);
        return res.status(500).json({
          error: 'An error occurred while fetching user quiz history.',
        });
      }

      res.json(rows);
    });
  } catch (error) {
    console.error('Error fetching user quiz history:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user quiz history.' });
  }
};

const uploadFileToDB = async (quizData) => {
  try {
    const expectedFields = [
      'Quiz Name',
      'QuestionText',
      'Choice1',
      'Choice2',
      'Choice3',
      'Choice4',
      'RightChoices',
      'Category',
      'MCQ/Scenario',
      'ProficiencyLevel(Intermediate/Advanced)',
    ];

    const missingFields = expectedFields.filter(
      (field) => !Object.keys(quizData[0]).includes(field)
    );
    if (missingFields.length > 0) {
      throw new Error(
        'Error: Missing field(s) in Excel sheet: ' + missingFields.join(', ')
      );
    }

    // Iterate over each distinct quizName
    const uniqueQuizNames = [
      ...new Set(quizData.map((data) => data['Quiz Name'])),
    ];
    for (const quizName of uniqueQuizNames) {
      let quizId;

      // Check if quiz with the same name exists
      const existingQuizQuery = 'SELECT quiz_id FROM quiz WHERE quiz_name = ?';
      const existingQuizResult = await executeQuery(existingQuizQuery, [
        quizName,
      ]);

      if (existingQuizResult.length > 0) {
        quizId = existingQuizResult[0].quiz_id;
      } else {
        quizId = uuidv4(); // Generate quiz ID for new quiz
        // Insert new quiz data
        const quizInsertQuery =
          'INSERT INTO quiz (quiz_id, quiz_name, quiz_category, no_of_questions, no_of_times_played) VALUES (?, ?, ?, ?, 0)';
        await executeQuery(quizInsertQuery, [
          quizId,
          quizName,
          quizData[0]['Category'], // Assuming all questions under the same quiz have the same category
          0, // Initial number of questions is 0, will be updated later
        ]);
      }

      const questions = [];

      // Extract questions and options for the current quizName
      for (const data of quizData) {
        if (data['Quiz Name'] === quizName) {
          // Extract question details
          const questionContent = data['QuestionText'];
          const ques_type = data['MCQ/Scenario'] === 'MCQ' ? 0 : 1;
          const ques_proficiency_level =
            data['ProficiencyLevel(Intermediate/Advanced)'] === 'Intermediate'
              ? 1
              : data['ProficiencyLevel(Intermediate/Advanced)'] === 'Beginner'
              ? 0
              : 2;

          const options = Object.keys(data)
            .filter((key) => key.startsWith('Choice'))
            .map((key) => data[key]);

          const correctAnswers = (data['RightChoices'] || '')
            .toString()
            .split(',')
            .map(Number);

          questions.push({
            content: questionContent,
            options,
            correctAnswers,
            ques_type,
            ques_proficiency_level,
          });
        }
      }

      // Insert questions and options data
      for (const question of questions) {
        const questionId = uuidv4();

        // Insert question data
        const questionInsertQuery =
          'INSERT INTO quiz_question (question_id, quiz_id, question_content, ques_proficiency_level, ques_type) VALUES (?, ?, ?, ?, ?)';
        await executeQuery(questionInsertQuery, [
          questionId,
          quizId,
          question.content,
          question.ques_proficiency_level,
          question.ques_type,
        ]);

        for (let i = 0; i < question.options.length; i++) {
          const optionValue = question.options[i];
          const isCorrect = question.correctAnswers.includes(i + 1) ? 0 : 1;

          const optionInsertQuery =
            'INSERT INTO options (option_id, quiz_id, question_id, option_value, correct_01) VALUES (?, ?, ?, ?, ?)';
          await executeQuery(optionInsertQuery, [
            uuidv4(),
            quizId,
            questionId,
            optionValue,
            isCorrect,
          ]);
        }
      }
    }
  } catch (error) {
    throw new Error('Error uploading quiz data to DB: ' + error.message);
  }
};

const executeQuery = async (query, params) => {
  try {
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    throw new Error('Error executing SQL query: ' + error.message);
  }
};

module.exports = { addQuiz, getUserQuizHistory };
