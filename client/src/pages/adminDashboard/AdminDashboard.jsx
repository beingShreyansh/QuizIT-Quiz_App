// UploadExcelController.js
import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:3001/admin/addQuiz",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error("Error uploading file: " + error.message);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post(
        "http://localhost:3001/admin/addQuiz",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        
      console.log(response);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default App;
