import React from 'react';

const Modal1 = ({ isOpen, onClose, children }) => {
  const handleModalClick = (e) => {
    // Prevent modal from closing when clicking inside the modal
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={handleModalClick}
        style={{
          background: "white",
          height: "90vh",
          width: "90vw",
          margin: "auto",
          padding: "2%",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: "2px solid black",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal1;