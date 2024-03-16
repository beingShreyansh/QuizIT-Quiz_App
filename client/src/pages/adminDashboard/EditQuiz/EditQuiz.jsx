// EditQuiz.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './EditQuiz.css'; // Import CSS file for styling
import CombinedModal from '../../../components/Modal/CombinedModal'; // Import CombinedModal component
import UpdateQuestionForm from '../../../components/Modal/UpdateQuetionForm'; // Import UpdateQuestionForm component
import Navbar from '../../../components/Navbar/Navbar';

function EditQuiz() {
    // State to store quizzes and selected quiz questions
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [combinedModalOpen, setCombinedModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [quizId,setquizId]=useState(null);

    // Fetch quizzes from the backend API
    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/editQuiz/categories`);
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };
    useEffect(() => {
     

        fetchQuizzes();
    }, []);

    // Function to handle editing a quiz and fetching questions/options
    const editQuiz = async (quizId, quizName) => {
        try {
            setquizId(quizId);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/editQuiz/questions-and-options/${quizId}`);
            console.log(response.data); // Log response data to inspect its structure
            setSelectedQuiz(response.data);
            setCombinedModalOpen(true); // Open the combined modal when questions are fetched
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }
    const updateQuestion = (question) => {
        setSelectedQuestion(question);
        setUpdateModalOpen(true); 
    }

const deleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the quiz '${quizId}'?`);
    if (confirmDelete) {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/editQuiz/delete-quiz/${quizId}`);
        setQuizzes(quizzes.filter(quiz => quiz.quiz_id !== quizId)); // Update state to remove the deleted quiz
        alert(`Quiz '${quizId}' deleted successfully.`);
    } catch (error) {
        console.error('Error deleting quiz:', error);
        alert(`Error deleting quiz '${quizId}'.`);
    }
}
else {
    // If the user cancels deletion
    alert('Deletion canceled.');
}
}



    // Function to handle adding questions
    const addQuestions = (quizId) => {
        alert(`Add questions for quiz id ${quizId}`);
    }

    return (

        <div> <Navbar />
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

                                <FontAwesomeIcon icon={faEdit} className="icon edit-icon" onClick={() => editQuiz(quiz.quiz_id, quiz.quiz_name)} style={{ marginRight: '50px' }} />
                                
                               
                                <FontAwesomeIcon icon={faTrashAlt} className="icon edit-icon"  onClick={() => deleteQuiz(quiz.quiz_id)} />
                                
                            </td>
                            <td><FontAwesomeIcon icon={faPlusCircle} className="add-icon"  onClick={() => addQuestions(quiz.quiz_id)} /></td>
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
                    quizId={quizId}
                    fetchQuizzes ={fetchQuizzes}
                />
            )}

            {/* Update Question Form */}
            {updateModalOpen && (
                <UpdateQuestionForm 
                    isOpen={updateModalOpen} 
                    onClose={() => setUpdateModalOpen(false)} 
                    question={selectedQuestion} // Pass the selected question to update
                    quizId={quizId}
                />
            )}
        </div>
        </div>
    );
}

export default EditQuiz;