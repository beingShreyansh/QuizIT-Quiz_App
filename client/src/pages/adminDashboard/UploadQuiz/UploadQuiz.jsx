// UploadExcelController.js
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./UploadQuiz.css"; // Import CSS file for styling
import Navbar from "../../../components/Navbar/Navbar";

const UploadQuiz = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (
        selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const response = await axios.post(
          "http://localhost:3001/admin/addQuiz",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("File uploa ded successfully.");
      } else {
        toast.error("File Type not allowed! ");
      }
    } catch (error) {
      console.error(error);
      toast.error("File not submitted");
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <div className="upload-box">
          <h1 className="upload-heading">Upload Excel File</h1>
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
        </div>
        <div className="instruction-box">
          <h2 className="instruction-heading">Instructions:</h2>
          <ul className="instruction-list">
            <li>File should be Excel Sheet.</li>
            <li>Should only upload one sheet at a time</li>
            <li>Rule 3 goes here.</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UploadQuiz;
