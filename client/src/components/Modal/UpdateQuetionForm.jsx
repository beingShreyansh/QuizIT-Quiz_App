import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./UpdateQuestionForm.css"; // Import the CSS file
import axios from "axios";


function UpdateQuestionForm({
  isOpen,
  onClose,
  selectedQuestionId,
  selectedOptionId,
  initialData,
  quizId,
}) {

  

  // Define state variables for form fields and options
  const [questionContent, setQuestionContent] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [OptionA, setOptionA] = useState("");
  const [OptionB, setOptionB] = useState("");
  const [OptionC, setOptionC] = useState("");
  const [OptionD, setOptionD] = useState("");
  const [OptionE, setOptionE] = useState("");
  
  const [imageUrl, setImageUrl] = useState("");

  const proficiencyLevels = {
    Beginner: "0",
    Intermediate: "1",
    Advanced: "2",
  };
  const questionTypes = {
    MCQ: "0",
    Scenario: "1",
  };

  // Populate form fields with initial data on component mount
  useEffect(() => {
    console.log("initialData:", initialData);
    if (initialData) {
      console.log("Setting state values from initialData:", initialData);
      setQuestionContent(initialData.question_content || "");
      setProficiencyLevel(initialData.ques_proficiency_level || "");
      setQuestionType(initialData.ques_type || "");
      setOptionA(initialData.option_1 || "");
      setOptionB(initialData.option_2 || "");
      setOptionC(initialData.option_3 || "");
      setOptionD(initialData.option_4 || "");
      setOptionE(initialData.option_5 || "");
      
      setImageUrl(initialData.imageId || "");
    }
  }, [initialData]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data to send to the backend
      const requestData = {
        quizId: quizId,
        questionId: selectedQuestionId,
        optionId: selectedOptionId, // Assuming optionId is needed for the controller
      };

      if (questionContent) {
        requestData.questionContent = questionContent;
      }

      if (proficiencyLevel) {
        requestData.proficiencyLevel = proficiencyLevel;
      }

      if (questionType) {
        requestData.questionType = questionType;
      }

      if (OptionA) {
        requestData.option_1 = OptionA;
      }

      if (OptionB) {
        requestData.option_2 = OptionB;
      }

      if (OptionC) {
        requestData.option_3 = OptionC;
      }

      if (OptionD) {
        requestData.option_4 = OptionD;
      }

      if (OptionE) {
        requestData.option_5 = OptionE;
      }
      
      if (imageUrl) {
        requestData.imageUrl = imageUrl;
      }

      console.log(requestData);
      // Make a PUT request to update the question
      await axios.put(
        `${import.meta.env.VITE_API_URL}/editQuiz/update/${
          requestData.questionId
        }`,
        requestData
      );
       // Show success 
       alert("Question updated successfully.");
      
      // Close the form after successful update
      onClose();
    } catch (error) {
      console.error("Error updating question:", error);
      // Handle error state or show an error message to the user
    }
  };

  return (
    <div className={`update-form-container ${isOpen ? "open" : ""}`}>
      <div className="update-form-content">
        <div className="modal-header">
          <h2 className="modal-title">Update Question and Options</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form className="update-form" onSubmit={handleSubmit}>
          <label className="update-form-label">Question Content:</label>
          <input
            className="update-form-input"
            type="text"
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
          />

          <label className="update-form-label">Proficiency Level:</label>
          <select
            className="update-form-select"
            value={proficiencyLevel}
            onChange={(e) => setProficiencyLevel(e.target.value)}
          >
            <option value="">Select Proficiency Level</option>
            {Object.keys(proficiencyLevels).map((level) => (
              <option key={level} value={proficiencyLevels[level]}>
                {level}
              </option>
            ))}
          </select>

          <label className="update-form-label">Question Type:</label>
          <select
            className="update-form-select"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="">Select Question Type</option>
            {Object.keys(questionTypes).map((type) => (
              <option key={type} value={questionTypes[type]}>
                {type}
              </option>
            ))}
          </select>
          <label className="update-form-label">Option A:</label>
          <input
            className="update-form-input"
            type="text"
            value={OptionA}
            onChange={(e) => setOptionA(e.target.value)}
          />
          <label className="update-form-label">Option B:</label>
          <input
            className="update-form-input"
            type="text"
            value={OptionB}
            onChange={(e) => setOptionB(e.target.value)}
          />
          <label className="update-form-label">Option C:</label>
          <input
            className="update-form-input"
            type="text"
            value={OptionC}
            onChange={(e) => setOptionC(e.target.value)}
          />
          <label className="update-form-label">Option D:</label>
          <input
            className="update-form-input"
            type="text"
            value={OptionD}
            onChange={(e) => setOptionD(e.target.value)}
          />
          <label className="update-form-label">Option E:</label>
          <input
            className="update-form-input"
            type="text"
            value={OptionE}
            onChange={(e) => setOptionE(e.target.value)}
          />
         
          <label className="update-form-label"> Image Url:</label>
          <input
            className="update-form-input"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div className="update-form-buttons">
            <button className="update-form-button" type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateQuestionForm;
