import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./UpdateQuestionForm.css"; // Import the CSS file
import toast from "react-hot-toast";

function UpdateQuestionForm({
  isOpen,
  onClose,
  selectedQuestionId,
  selectedOptionId,
  initialData,
  quizId,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    questionContent: "",
    proficiencyLevel: "",
    questionType: "",
    options: [
      { value: "", isCorrect: false }, // Default values for option A
      { value: "", isCorrect: false }, // Default values for option B
      { value: "", isCorrect: false }, // Default values for option C
      { value: "", isCorrect: false }, // Default values for option D
      { value: "", isCorrect: false }, // Default values for option E
    ],
    imageUrl: "",
    imageId: "",
  });

  useEffect(() => {
    if (initialData) {
      const {
        question_content,
        ques_proficiency_level,
        ques_type,
        option_1,
        option_2,
        option_3,
        option_4,
        option_5,
        imageUrl,
        correct_options,
      } = initialData;

      const options = [
        {
          value: option_1 || "",
          isCorrect: correct_options.includes(option_1),
        },
        {
          value: option_2 || "",
          isCorrect: correct_options.includes(option_2),
        },
        {
          value: option_3 || "",
          isCorrect: correct_options.includes(option_3),
        },
        {
          value: option_4 || "",
          isCorrect: correct_options.includes(option_4),
        },
        {
          value: option_5 || "",
          isCorrect: correct_options.includes(option_5),
        },
      ];
      setFormData({
        ...formData,
        questionContent: question_content || "",
        proficiencyLevel: ques_proficiency_level || "",
        questionType: ques_type || "",
        options,
        imageUrl: imageUrl || "",
      });
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handlePut = async () => {
    try {
      if (selectedImage.name) {
        const signedUrlResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/editQuiz/get-signed-url`,
          {
            params: {
              fileName: selectedImage.name,
              contentType: selectedImage.type,
            },
          }
        );

        const putResponse = await axios.put(
          signedUrlResponse.data.signedUrl,
          selectedImage,
          {
            headers: {
              "Content-Type": "image/jpeg",
            },
          }
        );


        const questionId = initialData.question_id;
        if (putResponse.status === 200) {
          // Update imageId for the user
          const updateResponse = await axios.put(
            `${import.meta.env.VITE_API_URL}/editQuiz/putImageIdToOption/${
              signedUrlResponse.data.imageId
            }`,
            { quizId, questionId}
          );
          setFormData({ ...formData, imageId: signedUrlResponse.data.imageId });
          toast.success("Image uploaded successfully");
        }
      } else {
        toast.error("Upload a image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let isValid = false;
      formData.options.map((option) => {
        if (option.isCorrect !== false) return (isValid = true);
      });

      if (isValid == false) {
        return toast.error("Right option is not Selected!!");
      } else {
        const requestData = {
          quizId,
          questionId: selectedQuestionId,
          optionId: selectedOptionId,
          questionContent: formData.questionContent,
          proficiencyLevel: formData.proficiencyLevel,
          questionType: formData.questionType,
          options: formData.options,
          imageId: formData.imageId,
        };

        const cleanedRequestData = Object.fromEntries(
          Object.entries(requestData).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        );

        await axios.put(
          `${import.meta.env.VITE_API_URL}/editQuiz/update/${
            cleanedRequestData.questionId
          }`,
          cleanedRequestData
        );

        toast.success("Question updated successfully.");
        onClose();
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].value = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...formData.options];
    newOptions[index].isCorrect = !newOptions[index].isCorrect;
    setFormData({ ...formData, options: newOptions });
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
            value={formData.questionContent}
            onChange={(e) =>
              setFormData({ ...formData, questionContent: e.target.value })
            }
          />

          <label className="update-form-label">Proficiency Level:</label>
          <select
            className="update-form-select"
            value={formData.proficiencyLevel}
            onChange={(e) =>
              setFormData({ ...formData, proficiencyLevel: e.target.value })
            }
          >
            <option value="">Select Proficiency Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <label className="update-form-label">Question Type:</label>
          <select
            className="update-form-select"
            value={formData.questionType}
            onChange={(e) =>
              setFormData({ ...formData, questionType: e.target.value })
            }
          >
            <option value="">Select Question Type</option>
            <option value="MCQ">MCQ</option>
            <option value="Scenario">Scenario</option>
          </select>

          {formData.options.map((option, index) => (
            <div className="label-input-container" key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={() => handleCheckboxChange(index)}
                />
              </label>
              <label className="update-form-label">
                Option {String.fromCharCode(65 + index)}:
              </label>
              <input
                className="update-form-input"
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
          ))}

          <h2>Change Profile Picture</h2>
          <div className="avatar-container">
            <label htmlFor="file-inputs" className="file-labels">
              <img
                src={formData.imageUrl || "placeholder-image-url"} // Use a placeholder image if no image is selected
                alt="--------No URL----"
                className="avatar-imageUrl"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-inputs-question-url"
              id="file-inputs"
            />
          </div>
          <button className="upload-btn" onClick={handlePut}>
            Upload
          </button>

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
