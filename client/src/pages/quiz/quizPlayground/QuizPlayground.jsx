import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios library
import QuizCard from "../../../components/QuizCard/QuizCard";
import ReviewPanel from "./ReviewPanel/ReviewPanel";
import "./QuizPlayground.css";
import toast from "react-hot-toast";
import Modal from "react-modal"; // Import Modal from react-modal library
import { useParams } from "react-router-dom";

Modal.setAppElement("#root");

function QuizPlayground() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [score, setScore] = useState(10);
  const [answers, setAnswers] = useState({});

  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    quizData: [],
    timeTaken: timer,
    categoryName: "",
    userID: "",
  });
  let { id } = useParams();

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setFormData((prevFormData) => ({
      ...prevFormData,
      timeTaken: timer,
    }));
  };

  const handleTimerTick = () => {
    if (isTimerRunning && timer >= 120) {
      stopTimer(); // Stop the timer
      handleSubmitQuiz(); // Submit the quiz
    } else if (isTimerRunning) {
      setTimer((prevTimer) => prevTimer + 1);
    }
  };

    useEffect(() => {
      startTimer();
      return () => {
        stopTimer();
      };
    }, []);

  useEffect(() => {
    const interval = setInterval(handleTimerTick, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/quiz/getQuiz/${id}`
        );
        setQuizData(response.data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, []);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(128, 128, 128, 0.5)",
    },
    content: {
      backgroundColor: "lightgrey",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
      maxWidth: "600px",
      margin: "auto",
      color: "black",
    },
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNextQuestion = () => {
    if (!quizSubmitted) {
      const selectedOption = answers[quizData[questionIndex]?.id];
      if (selectedOption) {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [quizData[questionIndex]?.id]: selectedOption,
        }));
      }
      if (questionIndex < quizData.length - 1) {
        setQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (!quizSubmitted) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const setSelectedOption = (option) => {
    if (!quizSubmitted) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [quizData[questionIndex]?.id]: option,
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        quizData: [
          ...prevFormData.quizData,
          {
            questionId: quizData[questionIndex]?.id,
            answerSelected: option,
          },
        ],
      }));
    }
  };

  const markAsReview = (questionId) => {
    if (!quizSubmitted) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: "review",
      }));
    }
  };

  const handleSubmitQuiz = () => {
    stopTimer();
    setQuizSubmitted(true);
    const underReview = Object.values(answers).some(
      (answer) => answer === "review"
    );
    if (!underReview) {
      openModal();
      setFormData({
        ...formData,
        timeTaken: timer,
        quizData: quizData.map((questionData) => ({
          questionId: questionData.id,
          answerSelected: answers[questionData.id] || "Not Answered",
        })),
        categoryName: "Your Category Name",
        userID: localStorage.getItem("userId"),
      });
    } else {
      toast.error(
        "One or more questions are under review. Please complete all reviews before submitting."
      );
    }
  };

  return (
    <div className="quiz-playground-container">
      <div className="timer">
        Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
        {timer % 60}
      </div>
      <div className="review-quiz-container">
        <div className="review-panel">
          <ReviewPanel
            quizData={quizData}
            answers={answers}
            questionIndex={questionIndex}
            setQuestionIndex={setQuestionIndex}
            markAsReview={markAsReview}
          />
        </div>
        <div className="quiz-container">
          {quizData.length > 0 && (
            <QuizCard
              key={quizData[questionIndex]?.id}
              questionNo={questionIndex + 1}
              question={quizData[questionIndex]?.question}
              options={quizData[questionIndex]?.options}
              selectedOption={answers[quizData[questionIndex]?.id]}
              setSelectedOption={setSelectedOption}
            />
          )}
          <div className="prev-next-buttons">
            <button
              onClick={handlePrevQuestion}
              disabled={questionIndex === 0 || quizSubmitted}
            >
              Prev
            </button>
            <button onClick={handleSubmitQuiz}>Submit Quiz</button>
            <button onClick={handleNextQuestion}>Next</button>
          </div>
          {/* Note indicating inability to change options after submission */}

          <p className="submission-note">
            Note: After submission, you will not be able to change your answers.
          </p>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Quiz Summary"
        style={customStyles} // Apply custom styles
      >
        <h2>Quiz Summary</h2>
        <p>Total Questions: {quizData.length}</p>
        <p>Attempted Questions: {Object.keys(answers).length}</p>
        <p>
          Unattempted Questions: {quizData.length - Object.keys(answers).length}
        </p>
        <p>Total Score: {score}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default QuizPlayground;
