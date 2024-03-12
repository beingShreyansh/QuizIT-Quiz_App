// UpdateQuestionForm.js

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './UpdateQuestionForm.css'; // Import the CSS file
import axios from 'axios';
function UpdateQuestionForm({ isOpen, onClose, selectedQuestionId }) {
    // Define state variables for form fields and options
    const [questionContent, setQuestionContent] = useState('');
    const [diagramUrl, setDiagramUrl] = useState('');
    const [proficiencyLevel, setProficiencyLevel] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [optionValue, setOptionValue] = useState(''); 
    const [options, setOptions] = useState([]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a PUT request to update the question
            await axios.put(`${import.meta.env.VITE_API_URL}/edit/update/${selectedQuestionId}`, {
                questionContent,
                diagramUrl,
                proficiencyLevel,
                questionType,
                optionValue,
                options, 
            });

            // Close the form after successful update
            onClose();
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    // Function to add a new option
    const addOption = () => {
        setOptions([...options, '']); // Add an empty option
    };

    // Function to update an option value
    const updateOption = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // Function to remove an option
    const removeOption = (index) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1); // Remove the option at the specified index
        setOptions(updatedOptions);
    };

    return (
        <div className={`update-form-container ${isOpen ? 'open' : ''}`}>
               <div className="update-form-content" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <button className="update-form-close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="update-form-title">Update Question</h2>
                <form className="update-form" onSubmit={handleSubmit}>
                    <label className="update-form-label">Question Content:</label>
                    <input className="update-form-input" type="text" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} />
                    <label className="update-form-label">Diagram URL:</label>
                    <input className="update-form-input" type="text" value={diagramUrl} onChange={(e) => setDiagramUrl(e.target.value)} />
                    <label className="update-form-label">Proficiency Level:</label>
                    <input className="update-form-input" type="text" value={proficiencyLevel} onChange={(e) => setProficiencyLevel(e.target.value)} />
                    <label className="update-form-label">Question Type:</label>
                    <input className="update-form-input" type="text" value={questionType} onChange={(e) => setQuestionType(e.target.value)} />
                    <div className="options-container">
                        <label className="update-form-label">Options:</label>
                        {options.map((option, index) => (
                            <div key={index} className="option-row">
                                <input className="update-form-input" type="text" value={option} onChange={(e) => updateOption(index, e.target.value)} />
                                <button type="button" className="remove-option-button" onClick={() => removeOption(index)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" className="add-option-button" onClick={addOption}>Add Option</button>
                    </div>
                    <div className="update-form-buttons">
                        <button className="update-form-button" type="submit">Update</button>
                        <button className="update-form-button" onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default UpdateQuestionForm;