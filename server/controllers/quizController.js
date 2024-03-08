const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Controller to fetch categories from the database
const fetchCategories = (req, res) => {
    const query = 'SELECT quiz_id, quiz_category, quiz_name FROM quiz';
    pool.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const quizData = JSON.parse(JSON.stringify(results));
            res.json(quizData);
        }
    });
};

// Controller to fetch questions and options by quiz name from the database
const fetchQuestionsAndOptions = (req, res) => {
    const quizName = req.params.quizName;
    const query = `
        SELECT 
            qq.question_id, 
            qq.question_content, 
            qq.ques_diagram_url, 
            qq.ques_proficiency_level, 
            qq.ques_type,
            MAX(CASE WHEN all_options.option_num = 1 THEN o.option_value END) AS option_1,
            MAX(CASE WHEN all_options.option_num = 2 THEN o.option_value END) AS option_2,
            MAX(CASE WHEN all_options.option_num = 3 THEN o.option_value END) AS option_3,
            MAX(CASE WHEN all_options.option_num = 4 THEN o.option_value END) AS option_4,
            MAX(CASE WHEN all_options.option_num = 5 THEN o.option_value END) AS option_5
        FROM 
            quiz q
        JOIN 
            quiz_question qq ON q.quiz_id = qq.quiz_id
        CROSS JOIN 
            (SELECT 1 AS option_num UNION ALL
             SELECT 2 UNION ALL
             SELECT 3 UNION ALL
             SELECT 4 UNION ALL
             SELECT 5) AS all_options
        LEFT JOIN 
            options o ON qq.question_id = o.question_id AND qq.quiz_id = o.quiz_id AND 
            (SELECT COUNT(*) FROM options WHERE question_id = qq.question_id AND quiz_id = qq.quiz_id AND option_id <= o.option_id) = all_options.option_num
        WHERE 
            q.quiz_name = ?
        GROUP BY 
            qq.question_id, 
            qq.question_content, 
            qq.ques_diagram_url, 
            qq.ques_proficiency_level, 
            qq.ques_type`;
    pool.query(query, [quizName], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const data = JSON.parse(JSON.stringify(results));
            res.json(data);
        }
    });
};

// In quizController.js
// Controller to update a specific question and its options
const updateQuestionAndOptions = (req, res) => {
    const { questionId } = req.params;
    const { questionContent, diagramUrl, proficiencyLevel, questionType, optionValue } = req.body;
    const query = `
        UPDATE quiz_question qq
        JOIN quiz q ON qq.quiz_id = q.quiz_id
        LEFT JOIN options o ON qq.question_id = o.question_id AND qq.quiz_id = o.quiz_id
        SET
            qq.question_content = ?,
            qq.ques_diagram_url = ?,
            qq.ques_proficiency_level = ?,
            qq.ques_type = ?,
            o.option_value = ?
        WHERE
            qq.question_id = ?;
    `;
    pool.query(query, [questionContent, diagramUrl, proficiencyLevel, questionType, optionValue, questionId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Question and options updated successfully' });
        }
    });
};

module.exports = { fetchCategories, fetchQuestionsAndOptions, updateQuestionAndOptions };