import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './UploadQuiz.css'; // Import CSS file for styling
import Navbar from '../../../components/Navbar/Navbar';

const UploadQuiz = () => {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState([
    { content: '', options: [{ content: '' }] },
  ]);
  const [requiresImages, setRequiresImages] = useState(false);
  const [numQuestionsWithImages, setNumQuestionsWithImages] = useState(0);

  // Handler for file upload
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handler for question content change
  const handleQuestionContentChange = (index, content) => {
    const newQuestions = [...questions];
    newQuestions[index].content = content;
    setQuestions(newQuestions);
  };

  // Handler for option content change
  const handleOptionContentChange = (qIndex, oIndex, content) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].content = content;
    setQuestions(newQuestions);
  };

  // Handler for adding a question
  const addQuestion = () => {
    setQuestions([...questions, { content: '', options: [{ content: '' }] }]);
  };

  // Handler for uploading the quiz
  const handleUpload = async () => {
    try {
      // Validation
      if (!selectedFile) {
        toast.error('No file selected');
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Append questions to form data
      questions.forEach((question, qIndex) => {
        formData.append(`question_${qIndex}_content`, question.content);
        question.options.forEach((option, oIndex) => {
          formData.append(
            `question_${qIndex}_option_${oIndex}_content`,
            option.content
          );
          if (requiresImages) {
            const optionImageInput = document.getElementById(
              `option-image-${qIndex}-${oIndex}`
            );
            if (optionImageInput && optionImageInput.files.length > 0) {
              formData.append(
                `question_${qIndex}_option_${oIndex}_image`,
                optionImageInput.files[0]
              );
            }
          }
        });
      });

      // Make POST request to upload the quiz
      const response = await axios.post(
        'http://localhost:3001/admin/addQuiz',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Handle response
      if (response.status === 410) {
        toast.error('File Name Already Exists');
      } else {
        toast.success('File uploaded successfully.');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 410) {
        toast.error('File Name Already Exists');
      } else {
        toast.error('File not submitted');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        {/* File upload section */}
        <div className="upload-box">
          <h1 className="upload-heading">Upload Excel File</h1>
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            accept=".xlsx, .xls"
          />
          {selectedFile && (
            <p className="file-selected">Selected File: {selectedFile.name}</p>
          )}
        </div>

        {/* Image requirement section */}
        <div className="image-requirement-box">
          <h2 className="image-requirement-heading">
            Do any questions or options require images?
          </h2>
          <label>
            <input
              type="checkbox"
              onChange={(e) => setRequiresImages(e.target.checked)}
            />{' '}
            Yes
          </label>
          {requiresImages && (
            <div className="num-questions-with-images">
              <label htmlFor="numQuestionsWithImages">
                How many questions require images?
              </label>
              <input
                type="number"
                id="numQuestionsWithImages"
                onChange={(e) =>
                  setNumQuestionsWithImages(parseInt(e.target.value))
                }
              />
            </div>
          )}
        </div>

        {/* Questions and options section */}
        <div className="question-options-box">
          <h2 className="question-heading">Questions</h2>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="question-container">
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                value={question.content}
                onChange={(e) =>
                  handleQuestionContentChange(qIndex, e.target.value)
                }
                className="question-input"
              />
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="option-container">
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option.content}
                    onChange={(e) =>
                      handleOptionContentChange(qIndex, oIndex, e.target.value)
                    }
                    className="option-input"
                  />
                  {requiresImages && qIndex < numQuestionsWithImages && (
                    <div className="image-upload-container">
                      <label htmlFor={`option-image-${qIndex}-${oIndex}`}>
                        Upload Image:
                      </label>
                      <input
                        type="file"
                        id={`option-image-${qIndex}-${oIndex}`}
                        className="image-input"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          <button onClick={addQuestion} className="add-question-button">
            Add Question
          </button>
        </div>

        {/* Upload button */}
        <div className="upload-button-box">
          <button
            onClick={handleUpload}
            className="upload-button"
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadQuiz;
