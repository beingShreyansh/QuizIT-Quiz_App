const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../dbConfig');

const addQuiz = async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const quizData = xlsx.utils.sheet_to_json(worksheet);

    await uploadQuizDataToDB(quizData);

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

    const rows = await executeQuery(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user quiz history:', error);
    res.status(500).json({ error: 'An error occurred while fetching user quiz history.' });
  }
};

const uploadQuizDataToDB = async (quizData) => {
  try {
    const expectedFields = ['Quiz Name', 'QuestionText', 'Choice1', 'Choice2', 'Choice3', 'Choice4', 'RightChoices', 'Category', 'MCQ/Scenario', 'ProficiencyLevel(Intermediate/Advanced)'];
    const missingFields = expectedFields.filter(field => !Object.keys(quizData[0]).includes(field));

    if (missingFields.length > 0) {
      throw new Error('Missing field(s) in Excel sheet: ' + missingFields.join(', '));
    }

    const uniqueQuizNames = [...new Set(quizData.map(data => data['Quiz Name']))];

    for (const quizName of uniqueQuizNames) {
      let quizId;

      const existingQuizQuery = 'SELECT quiz_id FROM quiz WHERE quiz_name = ?';
      const existingQuizResult = await executeQuery(existingQuizQuery, [quizName]);

      if (existingQuizResult.length > 0) {
        quizId = existingQuizResult[0].quiz_id;
      } else {
        quizId = uuidv4();
        const quizInsertQuery = 'INSERT INTO quiz (quiz_id, quiz_name, quiz_category, no_of_questions, no_of_times_played) VALUES (?, ?, ?, ?, 0)';
        await executeQuery(quizInsertQuery, [quizId, quizName, quizData[0]['Category'], 0]);
      }

      const questions = quizData.filter(data => data['Quiz Name'] === quizName).map(data => ({
        content: data['QuestionText'],
        options: [data['Choice1'], data['Choice2'], data['Choice3'], data['Choice4'], data['Choice5'], data['Choice6']],
        correctAnswers: data['RightChoices'].toString().split(',').map(Number),
        quesType: data['MCQ/Scenario'] === 'MCQ' ? 0 : 1,
        quesProficiencyLevel: data['ProficiencyLevel(Intermediate/Advanced)'] === 'Intermediate' ? 1 : data['ProficiencyLevel(Intermediate/Advanced)'] === 'Beginner' ? 0 : 2
      }));

      for (const question of questions) {
        const questionId = uuidv4();

        const questionInsertQuery = 'INSERT INTO quiz_question (question_id, quiz_id, question_content, ques_diagram_url, ques_proficiency_level, ques_type) VALUES (?, ?, ?, ?, ?, ?)';
        await executeQuery(questionInsertQuery, [questionId, quizId, question.content, null, question.quesProficiencyLevel, question.quesType]);

        for (let i = 0; i < question.options.length; i++) {
          const optionValue = question.options[i];
          const isCorrect = question.correctAnswers.includes(i + 1) ? 0 : 1;

          const optionInsertQuery = 'INSERT INTO options (option_id, quiz_id, question_id, option_value, correct_01) VALUES (?, ?, ?, ?, ?)';
          await executeQuery(optionInsertQuery, [uuidv4(), quizId, questionId, optionValue, isCorrect]);
        }
      }
    }
  } catch (error) {
    console.error('Error uploading quiz data to DB:', error);
    throw new Error('Error uploading quiz data to DB: ' + error.message);
  }
};

const executeQuery = async (query, params) => {
  try {
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw new Error('Error executing SQL query: ' + error.message);
  }
};

module.exports = { addQuiz, getUserQuizHistory };
