import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizCard from "../../../components/QuizCard/QuizCard";
import ReviewPanel from "./ReviewPanel/ReviewPanel";
import "./QuizPlayground.css";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

Modal.setAppElement("#root");

function QuizPlayground() {
  const {
    id,
    totalQuestions,
    beginnerRatio,
    intermediateRatio,
    advancedRatio,
  } = useParams();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/quiz/getQuiz/${id}/${totalQuestions}/${beginnerRatio}/${intermediateRatio}/${advancedRatio}`
        );
        console.log("API Response:", response);
        
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
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Changes you made may not be saved. Reloading the quiz will close the quiz. Are you sure you want to reload?";
      console.log(event);
    };

    const handleReloadConfirmation = (event) => {
      navigate("/");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleReloadConfirmation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleReloadConfirmation);
    };
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
    handleOptionSelection(option);
  };

  const handleNewSelectedOption = (option) => {
    handleOptionSelection(option);
  };

  const handleOptionSelection = (option) => {
    if (!quizSubmitted) {
      const questionId = quizData[questionIndex]?.questionId;
      const updatedAnswers = { ...answers, [questionId]: option };
      setAnswers(updatedAnswers);
    }
  };

  const markAsReview = (questionId) => {
    if (!quizSubmitted) {
      setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: "review" }));
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
        const updatedFormData = {
          userId: localStorage.getItem("userId"),
          quizId: id,
          answers,
          timeTaken: timer,
          date: Date.now(),
          attemptedQuestions: Object.keys(answers).length,
        };

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

  const getPieChartData = () => {
    const attemptedQuestions = Object.keys(answers).length;
    const unattemptedQuestions = quizData.length - attemptedQuestions;

    return [
      { name: "Attempted", value: attemptedQuestions },
      { name: "Unattempted", value: unattemptedQuestions },
    ];
  };

  return (
    <>
      {isModalLoading ? (
        <Spinner />
      ) : (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Quiz Summary"
          style={{
            overlay: { backgroundColor: "rgba(128, 128, 128, 0.5)" },
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
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="score-card">
            <p className="card-title">Total Score</p>
            <p className="card-number">{score}%</p>
          </div>

          <div className="attempted-card">
            <p className="card-title">Attempted Questions</p>
            <p className="card-number">{Object.keys(answers).length}</p>
          </div>

          <div className="unattempted-card">
            <p className="card-title">Unattempted Questions</p>
            <p className="card-number">
              {quizData.length - Object.keys(answers).length}
            </p>
          </div>

          <div className="total-questions-card">
            <p className="card-title">Total Questions</p>
            <p className="card-number">{quizData.length}</p>
          </div>

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
                <QuizCard
                questionNo={questionIndex + 1}
                question={quizData[questionIndex]?.question_content} // Pass the question_content property
                options={quizData[questionIndex]?.options}
                isMCQ={quizData[questionIndex]?.isMCQ}
                selectedOption={answers[quizData[questionIndex]?.question_id]}
                handleSelectedOption={handleSelectedOption}
                handleNewSelectedOption={handleNewSelectedOption}
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
