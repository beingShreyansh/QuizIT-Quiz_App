const { request } = require("express");
const mysql = require("mysql");
const { uploadImageToS3, putQuestionObject, getObjectUrl } = require("../awsConfig");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../dbConfig");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Controller to fetch categories from the database
const fetchCategories = (req, res) => {
  const query = "SELECT quiz_id, quiz_category, quiz_name FROM quiz";
  pool.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const quizData = JSON.parse(JSON.stringify(results));
      res.json(quizData);
    }
  });
};

// Controller to fetch questions and options by quiz name from the database
const fetchQuestionsAndOptions = (req, res) => {
  const quizId = req.params.quizId;
  const questionId = req.params.questionId;

  const query = `
    SELECT 
      qq.question_id,
      qq.quiz_id, 
      qq.question_content, 
      qq.imageId,
      qq.ques_proficiency_level, 
      qq.ques_type,
      MAX(CASE WHEN all_options.option_num = 1 THEN o.option_value END) AS option_1,
      MAX(CASE WHEN all_options.option_num = 2 THEN o.option_value END) AS option_2,
      MAX(CASE WHEN all_options.option_num = 3 THEN o.option_value END) AS option_3,
      MAX(CASE WHEN all_options.option_num = 4 THEN o.option_value END) AS option_4,
      MAX(CASE WHEN all_options.option_num = 5 THEN o.option_value END) AS option_5,
      (SELECT GROUP_CONCAT(option_value) FROM options WHERE quiz_id = qq.quiz_id AND question_id = qq.question_id AND correct_01 = '1') AS correct_options
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
      q.quiz_id = ?
    GROUP BY 
      qq.question_id, 
      qq.question_content, 
      qq.imageId,
      qq.ques_proficiency_level, 
      qq.ques_type;
  `;

  pool.query(query, [quizId], async (error, results) => {
    if (error) {
      console.error("Error retrieving questions and options: ", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const data = JSON.parse(JSON.stringify(results));
    // Parse correct options into an array
    data.forEach(async (row) => {
      row.correct_options = row.correct_options
        ? row.correct_options.split(",")
        : [];

      if (row.imageId) {
        // Convert imageId to URL
        row.imageUrl = await getObjectUrl(
          `.uploads/questions/${row.imageId}.jpg`
        );
      }
    });

    // Wait for all image URLs to be fetched
    await Promise.all(
      data.map(async (row) => {
        if (row.imageId && !row.imageUrl) {
          row.imageUrl = await getObjectUrl(
            `.uploads/questions/${row.imageId}.jpg`
          );
        }
        return row;
      })
    );

    // Remove imageId from the response
    data.forEach((row) => {
      delete row.imageId;
    });

    res.json(data);
  });
};

// In quizController.js
const deleteQuiz = (req, res) => {
  const { quizId } = req.params;

  //  Identify user_history entries related to the quiz to be deleted
  const identifyUserHistoryEntries = () => {
    const query = `
            SELECT DISTINCT uh.quiz_id
            FROM user_history uh
            JOIN quiz q ON uh.quiz_id = q.quiz_id
            WHERE q.quiz_id = ?;
        `;
    pool.query(query, [quizId], (error, results) => {
      if (error) {
        console.error("Error identifying user history entries:", error);
        res.status(500).json({
          error: "An error occurred while identifying user history entries.",
        });
      } else {
        const missingQuizIds = results.map((result) => result.quiz_id);
        resolveUserHistoryEntries(missingQuizIds);
      }
    });
  };

  // Resolve any issues related to the identified quiz_id values in user_history
  const resolveUserHistoryEntries = (missingQuizIds) => {
    deleteQuizEntries();
  };

  // Delete the quiz after ensuring that there are no foreign key constraint violations
  const deleteQuizEntries = () => {
    // Query to delete options related to the quizName
    const deleteOptionsQuery = "DELETE FROM options WHERE quiz_id = ?";

    // Query to delete quiz_questions related to the quizName
    const deleteQuizQuestionsQuery =
      "DELETE FROM quiz_question WHERE quiz_id = ?";

    // Query to delete the quiz by quiz_name
    const deleteQuizQuery = "DELETE FROM quiz WHERE quiz_id = ?";

    // Execute deletion queries in sequence
    pool.query(deleteOptionsQuery, [quizId], (optionsError, optionsResults) => {
      if (optionsError) {
        console.error("Error deleting options:", optionsError);
        res
          .status(500)
          .json({ error: "An error occurred while deleting quiz options." });
        return;
      }

      pool.query(
        deleteQuizQuestionsQuery,
        [quizId],
        (questionsError, questionsResults) => {
          if (questionsError) {
            console.error("Error deleting quiz questions:", questionsError);
            res.status(500).json({
              error: "An error occurred while deleting quiz questions.",
            });
            return;
          }

          pool.query(deleteQuizQuery, [quizId], (quizError, quizResults) => {
            if (quizError) {
              console.error("Error deleting quiz:", quizError);
              res
                .status(500)
                .json({ error: "An error occurred while deleting the quiz." });
            } else {
              if (quizResults.affectedRows > 0) {
                res.status(200).json({ message: "Quiz deleted successfully." });
              } else {
                res.status(404).json({ error: "Quiz not found." });
              }
            }
          });
        }
      );
    });
  };

  // Call the function to start the process
  identifyUserHistoryEntries();
};

const updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const {
    questionContent,
    quizId,
    proficiencyLevel,
    questionType,
    options,
   
  } = req.body;

  const isValid = false;
  options.map((option) => {
    if (option.isCorrect !== false) return true;
  });

  if (isValid === false) {
    return res.send("Right option is not available");
  }

  let optionsLst = options.map((option) => option.value);

  // Start building the query to update the question
  let questionUpdateQuery = `
        UPDATE quiz_question qq
        INNER JOIN quiz q ON qq.quiz_id = q.quiz_id
        SET
            qq.question_content = ?,
            qq.ques_proficiency_level = ?,
            qq.ques_type = ?
        WHERE
            qq.question_id = ? AND q.quiz_id = ?;
    `;
  let quesUpdateQueryParams = [
    questionContent,
    proficiencyLevel,
    questionType,
    questionId,
    quizId,
  ];

  try {
    pool.query(questionUpdateQuery, quesUpdateQueryParams, (error, results) => {
      if (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Updating options
    let optionIdQuery = `
                      SELECT option_id
                      FROM options
                      WHERE quiz_id = ? AND question_id = ?;
                `;
    let optionIdQueryParams = [quizId, questionId];
    pool.query(
      optionIdQuery,
      optionIdQueryParams,
      (optionIdError, optionIdResults) => {
        if (optionIdError) {
          console.error("Error retrieving option_ids:", optionIdError);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          // Extract option_ids from the results
          const optionIds = optionIdResults.map((row) => row.option_id);
          // Construct and execute the query to update options
          let optionsQuery = `
              UPDATE options
              SET option_value = ?,
              correct_01 = ?
              WHERE option_id = ? AND question_id = ?;
          `;
          let optionsInsertQuery = `
              INSERT INTO options VALUES(?, ?, ?, ?, ?);
          `;
          // Execute the query to update options
          for (let i = 0; i < optionsLst.length; i++) {
            if (i < optionIds.length) {
              let optionsQueryParams = [
                optionsLst[i],
                options[i].isCorrect === true ? 1 : 0,
                optionIds[i],
                questionId,
              ];
              pool.query(
                optionsQuery,
                optionsQueryParams,
                (optionsError, optionsResults) => {
                  if (optionsError) {
                    console.error("Error updating options:", optionsError);
                    res.status(500).json({ error: "Internal Server Error" });
                  }
                }
              );
            } else {
              let optionId = uuidv4();
              let remOptionsQueryParams = [
                optionId,
                quizId,
                questionId,
                optionsLst[i],
                options[i] === "true" ? 1 : 0,
              ];
              pool.query(
                optionsInsertQuery,
                remOptionsQueryParams,
                (optionsError, optionsResults) => {
                  if (optionsError) {
                    console.error("Error updating options:", optionsError);
                    res.status(500).json({ error: "Internal Server Error" });
                  }
                }
              );
            }
          }
        }
        res.send(201);
      }
    );
  } catch (error) {
    res.send(error.message);
  }
};

const deleteQuestion = (req, res) => {
  const questionId = req.params.questionId;

  // Delete options associated with the question first
  const deleteOptionsQuery = "DELETE FROM options WHERE question_id = ?";
  pool.query(
    deleteOptionsQuery,
    [questionId],
    (optionsError, optionsResults) => {
      if (optionsError) {
        console.error("Error deleting options:", optionsError);
        res
          .status(500)
          .json({ error: "An error occurred while deleting options." });
        return;
      }
      // Once options are deleted, delete the question itself
      const deleteQuestionQuery =
        "DELETE FROM quiz_question WHERE question_id= ?";
      pool.query(
        deleteQuestionQuery,
        [questionId],
        (questionError, questionResults) => {
          if (questionError) {
            console.error("Error deleting question:", questionError);
            res.status(500).json({
              error: "An error occurred while deleting the question.",
            });
          } else {
            res.status(200).json({
              message: "Question and associated options deleted successfully.",
            });
          }
        }
      );
    }
  );
};

const getSignedObjectUrlToPutQues = async (req, res) => {
  try {
    const { fileName, contentType } = req.query;
    const key = uuidv4();
    const signedUrl = await putQuestionObject(key, contentType);
    res.json({ signedUrl, imageId: key });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

const putImageToOption = (req, res) => {
  const { imageId } = req.params;
  const { quizId } = req.body;
  const { questionId } = req.body;
s
  try {

    const updateQuery = "UPDATE quiz_question SET imageId = ? WHERE quiz_id = ? AND question_id= ?";
    db.query(updateQuery, [imageId, quizId,questionId]);

    res.send("Image ID updated successfully");
  } catch (error) {
    console.error("Error updating image ID:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  fetchCategories,
  fetchQuestionsAndOptions,
  deleteQuiz,
  updateQuestion,
  putImageToOption,
  deleteQuestion,
  getSignedObjectUrlToPutQues
};
