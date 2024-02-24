import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizCard from "../../../components/QuizCard/QuizCard";
import ReviewPanel from "./ReviewPanel/ReviewPanel";
import "./QuizPlayground.css";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";

Modal.setAppElement("#root");

function QuizPlayground() {
  let { id } = useParams();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selctedOption, setSelectedOption] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/quiz/getQuiz/${id}`
        );
        if (response.status === 200 && response.data.length > 0) {
          setQuizData(response.data);
          startTimer();
        } else {
          toast.error("No quiz found");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, [id]);

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
      if (questionType === "MCQ") {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionId]: option,
        }));
      } else {
        setAnswers((prevAnswers) => {
          const isSelected = prevAnswers[questionId]?.includes(option);
          if (isSelected) {
            const updatedOptions = prevAnswers[questionId].filter(
              (prevOption) => prevOption !== option
            );
            return {
              ...prevAnswers,
              [questionId]: updatedOptions,
            };
          } else {
            return {
              ...prevAnswers,
              [questionId]: [...(prevAnswers[questionId] || []), option],
            };
          }
        });
      }
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
    const underReview = Object.values(answers).some(
      (answer) => answer === "review"
    );
    if (!underReview) {
      stopTimer();
      setQuizSubmitted(true);
      openModal();
      setFormData({
        ...formData, // Spread the previous formData
        timeTaken: timer,
        quizData: answers,
        categoryName: id,
        userID: localStorage.getItem("userId"),
      });
    } else {
      toast.error(
        "One or more questions are under review. Please complete all reviews before submitting."
      );
    }
    console.log(formData);
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
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
            <QuizCard
              questionNo={questionIndex + 1}
              question={quizData[questionIndex]?.questionContent}
              options={quizData[questionIndex]?.options}
              questionType={quizData[questionIndex]?.questionType}
              selectedOption={selctedOption}
              handleSelectedOption={handleSelectedOption}
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
            <button
              onClick={handleNextQuestion}
              disabled={questionIndex === quizData.length - 1 || quizSubmitted}
            >
              Next
            </button>
          </div>
          <p className="submission-note">
            Note: After submission, you will not be able to change your answers.
          </p>
        </div>
      </div>
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
          Unattempted Questions: {quizData.length - Object.keys(answers).length}
        </p>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default QuizPlayground;
