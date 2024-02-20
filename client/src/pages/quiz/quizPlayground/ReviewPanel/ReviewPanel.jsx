// ReviewPanel.js
import React from "react";
import "./ReviewPanel.css";

const ReviewPanel = ({
  quizData,
  answers,
  questionIndex,
  setQuestionIndex,
  markAsReview,
}) => {
  const handleQuestionNavigation = (index) => {
    setQuestionIndex(index);
  };

  return (
    <div className="review-panel">
      <h3>Review Panel</h3>
      <div className="grid-container">
        {quizData.map((question, index) => (
          <div
            key={question.id}
            className={`review-item ${
              index === questionIndex ? "active" : ""
            } ${
              answers[question.id] ? "answered" : ""
            } ${answers[question.id] === "review" ? "review" : ""}`}
            onClick={() => handleQuestionNavigation(index)}
          >
            <span>{index + 1}</span>
            <button
              className="mark-as-review-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                markAsReview(question.id);
              }}
            >
              Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPanel;
