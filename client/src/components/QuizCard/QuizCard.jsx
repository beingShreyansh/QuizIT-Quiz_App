import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import './QuizCard.css';

const QuizCard = ({
  question,
  questionNo,
  options,
  questionType,
  selectedOption,
  handleSelectedOption,
}) => {
  const handleOptionChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (questionType === 'MCQ') {
      handleSelectedOption(value);
    } else {
      const updatedOptions = isChecked
        ? [...(selectedOption || []), value]
        : selectedOption.filter((option) => option !== value);
      handleSelectedOption(updatedOptions);
    }
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
              type={questionType === 'MCQ' ? 'radio' : 'checkbox'}
              id={`option-${index}`}
              label={option}
              value={option}
              checked={
                questionType === 'MCQ'
                  ? option === selectedOption
                  : (selectedOption || []).includes(option)
              }
              onChange={handleOptionChange}
            />
          ))}
        </Form.Group>
      </div>
    </div>
  );
};

QuizCard.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  questionNo: PropTypes.number.isRequired,
  questionType: PropTypes.oneOf(['MCQ', 'MSQ']).isRequired,
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  handleSelectedOption: PropTypes.func.isRequired,
};

export default QuizCard;
