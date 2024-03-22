// QuizPlayground.js

import React, { useState, useEffect } from "react";
import QuizCard from "./QuizCard";
import Modal from "react-modal";
import "./QuizPlayground.css";

const QuizPlayground = () => {
  const mockQuizData = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "Paris", "Madrid", "Rome"],
      correctOption: "Paris",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      correctOption: "Mars",
    },
    // Add more mock questions as needed
  ];

  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnswerSubmit = (correctOption, selectedOption) => {
    const isCorrect = correctOption === selectedOption;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      ...answers,
      { question: mockQuizData[questionIndex].question, isCorrect },
    ]);
    setQuestionIndex(questionIndex + 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (questionIndex === mockQuizData.length) {
      setIsModalOpen(true);
    }
  }, [questionIndex, mockQuizData.length]);

  return (
    <div className="quiz-playground-container">
      <QuizCard
        question={mockQuizData[questionIndex].question}
        options={mockQuizData[questionIndex].options}
        questionNo={questionIndex + 1}
        correctOption={mockQuizData[questionIndex].correctOption}
        selectedOption={answers[questionIndex]?.selectedOption}
        setSelectedOption={(selectedOption) =>
          setAnswers([...answers, { selectedOption }])
        }
        handleAnswerSubmit={handleAnswerSubmit}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Quiz Summary"
      >
        <h2>Quiz Summary</h2>
        <p>Total Questions: {mockQuizData.length}</p>
        <p>Attempted Questions: {answers.length}</p>
        <p>Unattempted Questions: {mockQuizData.length - answers.length}</p>
        <p>Total Score: {score}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default QuizPlayground;
