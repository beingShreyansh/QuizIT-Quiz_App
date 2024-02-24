import React from "react";

function Results({ isOpen, onClose, quizData, answers }) {
  return (
    <div>
      {/* Your modal content here */}
      {isOpen && (
        <div className="result-modal">
          <h2>Quiz Summary</h2>
          <p>Total Questions: {quizData.length}</p>
          <p>Attempted Questions: {Object.keys(answers).length}</p>
          <p>
            Unattempted Questions:{" "}
            {quizData.length - Object.keys(answers).length}
          </p>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Results;
