import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import "./QuizCard.css";

const QuizCard = ({
  question,
  questionNo,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    console.log("Selected option:", e.target.value);
  };

  return (
    <div className="quiz-card">
      <div className="question-box">
        <h2>
          {questionNo}.{question}
        </h2>
      </div>
      <div className="options-box">
        <Form.Group>
          {options.map((option, index) => (
            <Form.Check
              key={index}
              type="radio"
              id={`option-${index}`}
              label={option}
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
          ))}
        </Form.Group>
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
