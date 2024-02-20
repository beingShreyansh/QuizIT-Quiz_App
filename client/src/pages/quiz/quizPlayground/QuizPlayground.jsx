import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios library
import QuizCard from "../../../components/QuizCard/QuizCard";
import ReviewPanel from "./ReviewPanel/ReviewPanel";
import "./QuizPlayground.css";
import toast from "react-hot-toast";

function QuizPlayground() {
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimer(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleTimerTick = () => {
    if (isTimerRunning && timer >= 10) {
      stopTimer(); // Stop the timer
      handleSubmitQuiz(); // Submit the quiz
    } else if (isTimerRunning) {
      setTimer((prevTimer) => prevTimer + 1);
    }

  const fetchQuizData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/quiz/getQuiz");
      setQuizData(response.data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      stopTimer();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(handleTimerTick, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);
  

  };

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

  const isLastQuestion = questionIndex === quizData.length - 1;

  const handleSubmitQuiz = () => {
    stopTimer();
    setQuizSubmitted(true);
    const underReview = Object.values(answers).some(
      (answer) => answer === "review"
    );
    if (underReview) {
      toast.error(
        "One or more questions are under review. Please complete all reviews before submitting."
      );
    } else {
      console.log("Quiz submitted!", answers);
    }
  };

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
      <div className="timer">
        Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
        {timer % 60}
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
          {isLastQuestion ? (
            <button onClick={handleSubmitQuiz}>Submit Quiz</button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={
                questionIndex === quizData.length - 1 || quizSubmitted
              }
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPlayground;
