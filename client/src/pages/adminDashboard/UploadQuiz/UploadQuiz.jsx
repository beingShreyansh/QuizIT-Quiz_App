// UploadExcelController.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./UploadQuiz.css"; // Import CSS file for styling
import Navbar from "../../../components/Navbar/Navbar";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";

const UploadQuiz = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sheetFormatUrl, setSheetFormatUrl] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    try {
      setIsUploading(true);
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
        if (response.status === 410) {
          toast.error("File Name Already Exists");
        } else {
          setIsUploading(false);
          toast.success("File uploaded successfully.");
        }
      } else {
        toast.error("File type not allowed!");
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 410) {
        toast.error("Quiz Name already exists");
      } else toast.error("File not submitted");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/getCategories`
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("Error fetching quiz data. Please try again later.");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDownloadSheetFormat = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/getSheetFormatUrl`
      );
      const sheetUrl = response.data.url;
      setSheetFormatUrl(sheetUrl);
      if (sheetUrl) {
        window.open(sheetUrl, "_blank");
      } else {
        toast.error("Sheet format URL not available.");
      }
    } catch (error) {
      console.error("Error fetching sheet format URL:", error);
      toast.error("Error fetching sheet format URL. Please try again later.");
    }
  };

  return (
    <>
      {isUploading && <Spinner />}
      <div className="upload-container">
        <div className="upload-box">
          <h1 className="upload-heading">Upload Excel File</h1>
          <input
            type="file"
            onChange={(e) => {
              handleFileChange(e);
              setSelectedFile(e.target.files[0]);
            }}
            className="file-input"
            accept=".xlsx, .xls"
          />

          <button onClick={handleUpload} className="upload-button">
            Upload
          </button>
          {selectedFile && (
            <p className="file-selected">Selected File: {selectedFile.name}</p>
          )}
        </div>
        <div className="show-quiz-name-button-container">
          <button className="show-quiz-name-button" onClick={openModal}>
            Show All Quiz Names
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="All Quiz Names"
          style={{
            overlay: {
              backgroundColor: "rgba(128, 128, 128, 0.4)",
            },
            content: {
              backgroundColor: "lightgrey",
              border: "1px solid #ccc",
              outline: "none",
              padding: "20px",
              maxWidth: "600px",
              margin: "auto",
              color: "black",
            },
          }}
        >
          <h2 className="modal-heading">All Quiz Names</h2>
          <div className="modal-categories">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.quiz_id} className="modal-category-name">
                  {category.quiz_name}
                </div>
              ))
            ) : (
              <div className="no-data-container">
                <p>No quiz names available.</p>
              </div>
            )}
          </div>
          <button
            className="close-button"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </Modal>
        <div className="download-sheet-format-button-container">
          <button
            className="download-sheet-format-button"
            onClick={handleDownloadSheetFormat}
          >
            Download Sheet Format
          </button>
        </div>
        <div className="instruction-box">
          <h2 className="instruction-heading">Instructions:</h2>
          <ul className="instruction-list">
            <li>
              File should be an Excel Sheet (.xlsx or .xls) following the
              provided format.
            </li>
            <li>Only one sheet can be uploaded at a time.</li>
            <li>Do not upload the same file twice.</li>
            <li>
              If you are adding questions to an already added quiz, upload the
              file containing the new questions along with the quiz name.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UploadQuiz;
