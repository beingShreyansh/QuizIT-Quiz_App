import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Importing Modal and Button from React Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS for styling

const QuizInstruction = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Quiz Instructions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Instructions:</h5>
        <ul>
          <li>Read each question carefully before answering.</li>
          <li>Select the best answer from the provided options.</li>
          <li>You can navigate between questions using the "Prev" and "Next" buttons.</li>
          <li>Questions marked as "Review" will be revisited before submitting the quiz.</li>
          <li>There is a timer, So clock is ticking</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QuizInstruction;
