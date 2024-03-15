

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './UpdateQuestionForm.css'; // Import the CSS file
import axios from 'axios';

function UpdateQuestionForm({ isOpen, onClose, selectedQuestionId, selectedOptionId,initialData,quizId }) {
    // Define state variables for form fields and options
    const [questionContent, setQuestionContent] = useState('');
    //const [diagramUrl, setDiagramUrl] = useState('');
    const [proficiencyLevel, setProficiencyLevel] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [option_1, setOption_1] = useState('');
    const [option_2, setOption_2] = useState('');
    const [option_3, setOption_3] = useState('');
    const [option_4, setOption_4] = useState('');
    const [option_5, setOption_5] = useState('');
    const proficiencyLevels = {
        Beginner: '0',
        Intermediate: '1',
        Advanced: '2'
    };
    const questionTypes = {
        MCQ: '0',
        Scenario: '1',
    };


    // Populate form fields with initial data on component mount
    useEffect(() => {
        console.log("initialData:", initialData);
        if (initialData) {
            console.log("Setting state values from initialData:", initialData);
            setQuestionContent(initialData.question_content|| '');
            //setDiagramUrl(initialData.ques_diagram_url || '');
            setProficiencyLevel(initialData.ques_proficiency_level || '');
            setQuestionType(initialData.ques_type || '');
            setOption_1(initialData.option_1 || '');
            setOption_2(initialData.option_2 || '');
            setOption_3(initialData.option_3 || '');
            setOption_4(initialData.option_4 || '');
            setOption_5(initialData.option_5 || '');
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
    
            if (option_1) {
                requestData.option_1 = option_1;
            }
    
            if (option_2) {
                requestData.option_2 = option_2;
            }
    
            if (option_3) {
                requestData.option_3 = option_3;
            }
    
            if (option_4) {
                requestData.option_4 = option_4;
            }
    
            if (option_5) {
                requestData.option_5 = option_5;
            }
    
            console.log(requestData);
            // Make a PUT request to update the question
            await axios.put(`${import.meta.env.VITE_API_URL}/editQuiz/update/${requestData.questionId}`, requestData);
    
            // Close the form after successful update
            onClose();
        } catch (error) {
            console.error('Error updating question:', error);
            // Handle error state or show an error message to the user
        }
    };
    
    return (
        <div className={`update-form-container ${isOpen ? 'open' : ''}`}>
            <div className="update-form-content">
                <div className="modal-header">
                    <h2 className="modal-title">Update Question and Options</h2>
                    <button className="close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                    <form className="update-form" onSubmit={handleSubmit}>
                    <label className="update-form-label">Question Content:</label>
                    <input className="update-form-input" type="text" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} />
                    
                    <label className="update-form-label"  >Proficiency Level:</label>
                    <select className="update-form-select"  value={proficiencyLevel} onChange={(e) => setProficiencyLevel(e.target.value)}>
                        <option value="">Select Proficiency Level</option>
                        {Object.keys(proficiencyLevels).map(level => (
                            <option key={level} value={proficiencyLevels[level]}>{level}</option>
                        ))}
                    </select>
                    
                    <label className="update-form-label">Question Type:</label>
                    <select className="update-form-select" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                        <option value="">Select Question Type</option>
                        {Object.keys(questionTypes).map(type => (
                            <option key={type} value={questionTypes[type]}>{type}</option>
                        ))}
                    </select>
                    <label className="update-form-label">Option_1:</label>
                    <input className="update-form-input" type="text" value={option_1} onChange={(e) => setOption_1(e.target.value)} />
                    <label className="update-form-label">Option_2:</label>
                    <input className="update-form-input" type="text" value={option_2} onChange={(e) => setOption_2(e.target.value)} />
                    <label className="update-form-label">Option_3:</label>
                    <input className="update-form-input" type="text" value={option_3} onChange={(e) => setOption_3(e.target.value)} />
                    <label className="update-form-label">Option_4:</label>
                    <input className="update-form-input" type="text" value={option_4} onChange={(e) => setOption_4(e.target.value)} />
                    <label className="update-form-label">Option_5:</label>
                    <input className="update-form-input" type="text" value={option_5} onChange={(e) => setOption_5(e.target.value)} />
                    
                    <div className="update-form-buttons">
                        <button className="update-form-button" type="submit">Update</button>
                       
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateQuestionForm;
 
