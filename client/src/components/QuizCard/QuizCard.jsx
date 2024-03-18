import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import './QuizCard.css';

const QuizCard = ({
  question,
  questionNo,
  options,
  isMCQ, // Ensure isMCQ is received as a prop
  selectedOption,
  handleSelectedOption,
  questionImageUrl
}) => {
  const handleOptionChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isMCQ) {
      handleSelectedOption(isChecked ? value : null);

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
        {questionImageUrl && <img className='question-image' src={questionImageUrl} alt='Question Image' />}
      </div>
      {console.log(questionImageUrl)}
      <div className="options-box">
        <Form.Group>
          {options.map((option, index) => (
            <Form.Check
              key={index}
              type={isMCQ ? 'radio' : 'checkbox'} // Change type based on isMCQ
              id={`option-${index}`}
              label={option}
              value={option}
              checked={
                isMCQ
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
  isMCQ: PropTypes.bool.isRequired, // Ensure isMCQ is received as a boolean prop
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  handleSelectedOption: PropTypes.func.isRequired,
};

export default QuizCard;
