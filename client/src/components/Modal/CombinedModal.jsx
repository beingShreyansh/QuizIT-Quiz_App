// CombinedModal.jsx

import React, { useState } from 'react';
import Modal1 from '../Modal/Modal1';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import './modal.css'; // Import the CSS file
import UpdateQuestionForm from './UpdateQuetionForm'; // Import the UpdateQuestionForm component

function CombinedModal({ isOpen, onClose, selectedQuiz }) {
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [updateFormOpen, setUpdateFormOpen] = useState(false);

    const openUpdateForm = (questionId) => {
        setSelectedQuestionId(questionId);
        setUpdateFormOpen(true);
    };

    return (
        <Modal1 isOpen={isOpen} onClose={onClose}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Questions and Options for Quiz: {selectedQuiz?.quizName}</h3>
                    <button className="close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="modal-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className="modal-table">
                        <thead>
                            <tr>
                                <th>question_content</th>
                                <th>ques_diagram_url</th>
                                <th>ques_type</th>
                                <th>option_1</th>
                                <th>option_2</th>
                                <th>option_3</th>
                                <th>option_4</th>
                                <th>option_5</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{ height: '200px', overflowY: 'auto' }}>
                            {selectedQuiz?.map((question, index) => (
                                <tr key={question.question_id}>
                                    <td>{question.question_content || '-'}</td>
                                    <td>{question.ques_diagram_url || '-'}</td>
                                    <td>{question.ques_type || '-'}</td>
                                    <td>{question.option_1 || '-'}</td>
                                    <td>{question.option_2 || '-'}</td>
                                    <td>{question.option_3 || '-'}</td>
                                    <td>{question.option_4 || '-'}</td>
                                    <td>{question.option_5 || '-'}</td>
                                    <td>
                                        <FontAwesomeIcon icon={faEdit} onClick={() => openUpdateForm(question.question_id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {updateFormOpen && (
                <UpdateQuestionForm isOpen={updateFormOpen} onClose={() => setUpdateFormOpen(false)} selectedQuestionId={selectedQuestionId} />
            )}
        </Modal1>
    );
}

export default CombinedModal;
