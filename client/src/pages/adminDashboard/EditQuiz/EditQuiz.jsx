// EditQuiz.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './EditQuiz.css'; // Import CSS file for styling
import CombinedModal from '../../../components/Modal/CombinedModal'; // Import CombinedModal component
import UpdateQuestionForm from '../../../components/Modal/UpdateQuetionForm'; // Import UpdateQuestionForm component

function EditQuiz() {
    // State to store quizzes and selected quiz questions
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [combinedModalOpen, setCombinedModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);

    // Fetch quizzes from the backend API
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/edit/categories`);
                setQuizzes(response.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    // Function to handle editing a quiz and fetching questions/options
    const editQuiz = async (quizId, quizName) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/edit/questions-and-options/${quizName}`);
            console.log(response.data); // Log response data to inspect its structure
            setSelectedQuiz(response.data);
            setCombinedModalOpen(true); // Open the combined modal when questions are fetched
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    // Function to handle updating a question
    const updateQuestion = (question) => {
        setSelectedQuestion(question);
        setUpdateModalOpen(true); // Open the update form when a question is selected for update
    }

    // Function to handle deleting a quiz
    // Function to handle deleting a quiz
const deleteQuiz = async (quizId) => {
    try {
        // Send a DELETE request to the backend API to delete the quiz
        await axios.delete(`${import.meta.env.VITE_API_URL}/edit/delete-quiz/${quizId}`);
        
        // After successful deletion, update the state to remove the deleted quiz
        setQuizzes((prevQuizzes) => prevQuizzes.filter(quiz => quiz.quiz_id !== quizId));

        // Optionally, you can display a success message or perform other actions
        alert(`Quiz with id ${quizId} deleted successfully`);
    } catch (error) {
        console.error('Error deleting quiz:', error);
        // Handle the error, display an error message, or perform other actions as needed
        alert('Error deleting quiz. Please try again.');
    }
}


    // Function to handle adding questions
    const addQuestions = (quizId) => {
        alert(`Add questions for quiz id ${quizId}`);
    }

    return (
        <div className="edit-quiz-container">
            <table className="edit-quiz-table">
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Quiz Category</th>
                        <th>Quiz Name</th>
                        <th>Actions</th>
                        <th>Add Questions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz, index) => (
                        <tr key={quiz.quiz_id}>
                            <td>{index + 1}</td>
                            <td>{quiz.quiz_category}</td>
                            <td>{quiz.quiz_name}</td>
                            <td>
                                <FontAwesomeIcon icon={faEdit} onClick={() => editQuiz(quiz.quiz_id, quiz.quiz_name)} />
                                <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteQuiz(quiz.quiz_id)} />
                            </td>
                            <td><FontAwesomeIcon icon={faPlusCircle} onClick={() => addQuestions(quiz.quiz_id)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Combined Modal */}
            {combinedModalOpen && (
                <CombinedModal 
                    isOpen={combinedModalOpen} 
                    onClose={() => setCombinedModalOpen(false)} 
                    selectedQuiz={selectedQuiz} 
                    updateQuestion={updateQuestion} // Pass the updateQuestion function
                />
            )}

            {/* Update Question Form */}
            {updateModalOpen && (
                <UpdateQuestionForm 
                    isOpen={updateModalOpen} 
                    onClose={() => setUpdateModalOpen(false)} 
                    question={selectedQuestion} // Pass the selected question to update
                />
            )}
        </div>
    );
}

export default EditQuiz;