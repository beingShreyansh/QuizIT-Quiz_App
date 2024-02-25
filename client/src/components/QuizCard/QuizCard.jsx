import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import "./QuizCard.css";

const QuizCard = ({
  question,
  questionNo,
  options,
  questionType,
  selectedOption,
  handleSelectedOption,
  handleSelectedOptions  ,
  handleNewSelectedOption
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleOptionChange = (e) => {
    const value = e.target.value;
    if (questionType === "MCQ") {
      handleSelectedOption(value);
    } else {
      const isChecked = e.target.checked;
      if (isChecked) {
        // If the checkbox is checked, add the option to selectedOption array
        handleSelectedOption([...selectedOption, value]);
      } else {
        // If the checkbox is unchecked, filter out the option from selectedOption array
        handleSelectedOption(
          selectedOption.filter((option) => option !== value)
        );
      }
    }
  };

  const handleCheckboxChange = (option) => {
    let newSelectedOptions;

    if (selectedOptions.includes(option)) {
      newSelectedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }

    setSelectedOptions(newSelectedOptions);
    handleSelectedOptions(newSelectedOptions)
    handleNewSelectedOption(newSelectedOptions)
  };

  const renderRadioForm = () => (
    <Form.Group>
      {options.map((option, index) => (
        <Form.Check
          key={index}
          type="radio"
          id={`option-${index}`}
          label={option}
          value={option}
          checked={option === selectedOption}
          onChange={handleOptionChange}
        />
      ))}
    </Form.Group>
  );

  const renderCheckboxForm = () => (
    <div>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          />
          {option}
        </div>
      ))}
    </div>
  );

  return (
    <div className="quiz-card">
      <div className="question-box">
        <h2>
          {questionNo}.{question}
        </h2>
      </div>
      <div className="options-box">
        {questionType === "MCQ" ? renderRadioForm() : renderCheckboxForm()}
      </div>
    </div>
  );
};

QuizCard.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  questionNo: PropTypes.number.isRequired,
  questionType: PropTypes.oneOf(["MCQ", "MSQ"]).isRequired,
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  handleSelectedOption: PropTypes.func.isRequired,
};

export default QuizCard;
