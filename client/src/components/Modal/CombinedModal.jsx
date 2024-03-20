import React, { useState, useRef } from "react";
import Modal1 from "./Modal1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./modal.css"; // Import the CSS file
import UpdateQuestionForm from "./UpdateQuetionForm";// Import the UpdateQuestionForm component
import axios from "axios";
//import NoData from "../../../assets/No-data.png";

function CombinedModal({
  isOpen,
  onClose,
  selectedQuiz,
  setQuizzes,
  quizId,
  fetchQuizzes,
}) {
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // New state to store selected question data
  const modalContentRef = useRef(null);
 // const [isNoData, setIsNoData] = useState(false);
  const openUpdateForm = (questionId) => {
    setSelectedQuestionId(questionId);
    const question = selectedQuiz.find((q) => q.question_id === questionId); // Find the selected question data
    setSelectedQuestion(question); // Set the selected question data to state
    setUpdateFormOpen(true);
  };

  const deleteQuestion = async (questionId) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the question`
    );

    if (confirmDelete) {
      try {
        // Send DELETE request to delete the question
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/editQuiz/questions/${questionId}`
        );
        setIsNoData(response.data.length === 0);
        alert(`Question deleted successfully.`);

        onClose();
      } catch (error) {
        console.error("Error deleting question:", error);
        alert(`Error deleting question`);
      }
    } else {
      // If the user cancels deletion
      alert("Deletion canceled.");
    }
  };

  const handleMouseDown = (e) => {
    if (modalContentRef.current && modalContentRef.current.contains(e.target)) {
      // Clicked inside the modal content, do nothing
      return;
    }
    // Clicked outside the modal content, close the modal
    onClose();
  };

  return (
    
    <Modal1 isOpen={isOpen} onClose={onClose}>
      <div
        className="modal-content"
        ref={modalContentRef}
        onMouseDown={handleMouseDown}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            Questions and Options for Quiz: {selectedQuiz?.quizId}
          </h3>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="modal-body">
        {/*{isNoData ? (
                        <div style={{ display: 'flex' }}>
                            <img src={NoData} alt="No data" style={{ margin: 'auto' }} />
                        </div>
                    ) : (*/}
          <table className="modal-table">
            <thead>
              <tr>
                <th>Question Content</th>
                <th>Option A</th>
                <th>Option B</th>
                <th>Option C</th>
                <th>Option D</th>
                <th>Option E</th>
                <th>Image URL</th> {/* Added Image URL column */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedQuiz?.map((question, index) => (
                <tr key={question.question_id}>
                  <td>{question.question_content || "-"}</td>
                  <td>{question.option_1 || "-"}</td>
                  <td>{question.option_2 || "-"}</td>
                  <td>{question.option_3 || "-"}</td>
                  <td>{question.option_4 || "-"}</td>
                  <td>{question.option_5 || "-"}</td>
                  <td>{question.imageId || "-"}</td> {/* Display Image URL */}
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => openUpdateForm(question.question_id)}
                      style={{ marginRight: "10px" }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteQuestion(question.question_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                    
        </div>
      </div>
      {updateFormOpen &&
        selectedQuestion && ( // Render the form only if selected question data exists
          <UpdateQuestionForm
            isOpen={updateFormOpen}
            onClose={() => setUpdateFormOpen(false)}
            selectedQuestionId={selectedQuestionId}
            initialData={selectedQuestion} // Pass the selected question data as initialData prop
            quizId={quizId}
          />
        )}
    </Modal1>
  );
}

export default CombinedModal;
