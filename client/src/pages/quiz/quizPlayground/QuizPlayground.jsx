import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizCard from "../../../components/QuizCard/QuizCard";
import ReviewPanel from "./ReviewPanel/ReviewPanel";
import "./QuizPlayground.css";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";

Modal.setAppElement("#root");

function QuizPlayground() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    setIsLoading(true);
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/quiz/getQuiz/${id}`
        );
        if (response.status === 200 && response.data.length > 0) {
          setQuizData(response.data);
          setIsLoading(false);
          startTimer();
        } else {
          navigate("/");
          toast.error("No quiz found");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, []);

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleNextQuestion = () => {
    if (!quizSubmitted && questionIndex < quizData.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (!quizSubmitted && questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSelectedOption = (option) => {
    if (!quizSubmitted) {
      const questionId = quizData[questionIndex]?.questionId;
      const questionType = quizData[questionIndex]?.questionType;

      // Check if there is already an answer for the current question ID
      if (answers[questionId]) {
        // If an answer exists, create a new entry with the updated option
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionId]: option,
        }));
      } else {
        // If no answer exists, directly set the answer for the current question ID
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionId]: option,
        }));
      }
      setSelectedOption(option);
    }
  };

  const handleNewSelectedOption = (option) => {
    if (!quizSubmitted) {
      const questionId = quizData[questionIndex]?.questionId;
      const questionType = quizData[questionIndex]?.questionType;

      // Check if there is already an answer for the current question ID
      if (answers[questionId]) {
        // If an answer exists, update it with the new selected options
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionId]: option,
        }));
      } else {
        // If no answer exists, directly set the answer for the current question ID
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionId]: option,
        }));
      }
      setSelectedOption(option);
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
  const handleSubmitQuiz = async () => {
    setIsModalLoading(true);
    const underReview = Object.values(answers).some(
      (answer) => answer === "review"
    );

    if (!underReview) {
      stopTimer();

      try {
        // Prepare data for quiz submission
        const updatedFormData = {
          userId: localStorage.getItem("userId"),
          quizId: id,
          answers,
          timeTaken: timer,
          date: Date.now(),
          attemptedQuestions: Object.keys(answers).length,
        };

        // Log the updatedFormData for debugging

        // Submit quiz data
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/quiz/get-results`,
          updatedFormData
        );

        if (response.status === 200) {
          setScore(response.data);
          openModal();
          setIsModalLoading(false);
          setQuizSubmitted(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error(
        "One or more questions are under review. Please complete all reviews before submitting."
      );
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {isModalLoading ? (
        <Spinner />
      ) : (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Quiz Summary"
          style={{
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
          }}
        >
          <h2>Quiz Summary</h2>
          <p>Total Questions: {quizData.length}</p>
          <p>Attempted Questions: {Object.keys(answers).length}</p>
          <p>
            Unattempted Questions:
            {quizData.length - Object.keys(answers).length}
          </p>
          <p>Score {score}</p>
          <button
            onClick={() => {
              setIsModalOpen(false);
              navigate("/");
            }}
          >
            Close
          </button>
        </Modal>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="quiz-playground-container">
          <div className="review-panel">
            <ReviewPanel
              quizData={quizData}
              answers={answers}
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
              markAsReview={markAsReview}
            />
          </div>
          <div className="review-quiz-container">
            <div className="timer">
              Timer: {Math.floor(timer / 60)}:{timer % 60}
            </div>
            <div className="quiz-container">
              {quizData.length > 0 && (
                <>
                  <QuizCard
                    questionNo={questionIndex + 1}
                    question={quizData[questionIndex]?.questionContent}
                    options={quizData[questionIndex]?.options}
                    questionType={quizData[questionIndex]?.questionType}
                    selectedOption={answers[quizData[questionIndex].questionId]}
                    handleSelectedOption={handleSelectedOption}
                    handleSelectedOptions={setSelectedOptions}
                    selectedOptionsMSQ={
                      answers[quizData[questionIndex].questionId]
                    }
                    handleNewSelectedOption={handleNewSelectedOption}
                  />
                </>
              )}
              <div className="prev-next-buttons">
                <button
                  onClick={handlePrevQuestion}
                  disabled={questionIndex === 0 || quizSubmitted}
                >
                  Prev
                </button>
                <button onClick={handleSubmitQuiz}>Submit Quiz</button>
                <button
                  onClick={handleNextQuestion}
                  disabled={
                    questionIndex === quizData.length - 1 || quizSubmitted
                  }
                >
                  Next
                </button>
              </div>
              <p className="submission-note">
                Note: After submission, you will not be able to change your
                answers.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuizPlayground;