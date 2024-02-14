const xlsx = require("xlsx");

const addQuiz = async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const quizData = xlsx.utils.sheet_to_json(worksheet);

    await uploadFileToDB(quizData);

    res.send("Quiz data uploaded successfully.");
  } catch (error) {
    console.error("Error uploading quiz data:", error);
    res.status(500).send("An error occurred while uploading quiz data.");
  }
};

uploadFileToDB = async (quizData) => {
  try {
    for (const quiz of quizData) {
      // Extract quiz details
      const quizName = quiz["Quiz Name"];
      const question = quiz["Question"];
      const correctAnswer = quiz["Correct Answer"];
      const options = Object.keys(quiz)
        .filter((key) => key.startsWith("Option"))
        .map((key) => quiz[key]);

      console.log("EXCEL:",quizName, question, correctAnswer, options);
    }
  } catch (error) {
    throw new Error("Error uploading quiz data to DB: " + error.message);
  }
};

module.exports = { addQuiz };
