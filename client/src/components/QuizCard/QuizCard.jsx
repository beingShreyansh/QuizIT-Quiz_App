// QuizCard.js

import React from "react";
import PropTypes from "prop-types";
import "./QuizCard.css";

const QuizCard = ({
  question,
  questionNo,
  options,
  selectedOption,
  setSelectedOption,
  correctOption,
  handleAnswerSubmit,
}) => {
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("Selected option:", e.target.value);
  };

  const handleSaveAndNext = () => {
    handleAnswerSubmit(correctOption, selectedOption, true);
  };

  return (
    <div className="quiz-card">
      <div className="question-box">
        <h2>
          {questionNo}.{question}
        </h2>
      </div>
      <div className="options-box">
        {options.map((option, index) => (
          <div className="options" key={index}>
            <label htmlFor={`option-${index}`}>
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              <span>
                {index + 1}---{">"}{" "}
              </span>
              {option}
            </label>
          </div>
        ))}
      </div>
      <div className="save-next-button">
        <button onClick={handleSaveAndNext}>Save and Next</button>
      </div>
    </div>
  );
};

// Add prop types validation to address ESLint errors
QuizCard.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  questionNo: PropTypes.number.isRequired,
  selectedOption: PropTypes.string,
  setSelectedOption: PropTypes.func.isRequired,
  correctOption: PropTypes.string.isRequired,
  handleAnswerSubmit: PropTypes.func.isRequired,
};

export default QuizCard;
