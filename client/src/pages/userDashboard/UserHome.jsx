import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./UserHome.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

const UserHome = () => {
  const [selectedCategory, setSelectedCategory] = useState({
    quiz_id: "",
    quiz_name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numOfQues, setNumOfQues] = useState(10);
  let qProfMap = new Map();
  qProfMap.set('beg', 10);
  qProfMap.set('imed', 80);
  qProfMap.set('adv', 10);
  const [quesProficiencyPerMap, setQuesProficiencyPer] = useState(qProfMap);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleNumOfQuesInpt = (event) => {
    const value = event.target.value;
    setNumOfQues(value);
  };

  const handleBegProficInptChange = (event) => {
    const value = event.target.value;
    qProfMap.set('beg', value);
    var imedVal = qProfMap.get('imed');
    var advVal = qProfMap.get('adv');
    setQuesProficiencyPer(qProfMap);
    if ((value + imedVal + advVal) != 100)
    {
      toast.error("Sum of Percentage is not equal to 100");
    } 
  }

  const handleImedProficInptChange = (event) => {
    const value = event.target.value;
    qProfMap.set('imed', value);
    setQuesProficiencyPer(qProfMap);
  }

  const handleAdvProficInptChange = (event) => {
    const value = event.target.value;
    qProfMap.set('adv', value);
    setQuesProficiencyPer(qProfMap);
  }

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setShowDropdown(false);
    setSearchTerm(category.quiz_name);

    setSelectedCategory({
      quiz_id: category.quiz_id,
      quiz_name: category.quiz_name,
    });
  };

  const handleStartQuiz = () => {
    if (selectedCategory.quiz_id) {
        const url = `/quiz/${selectedCategory.quiz_id}/${numOfQues}/${qProfMap.get('beg')}/${qProfMap.get('imed')}/${qProfMap.get('adv')}`;
        window.open(url, '_blank');
    } else {
        toast.error("Select a Category");
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
        setError("Error fetching quiz data. Please try again later.");
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  
  const filteredCategories = categories?.filter((category) =>
    category.quiz_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <Navbar />
      <div className="user-home-container">
        <h1>Welcome to QuizIT!</h1>
        <p>Please select a Quiz Name to start the quiz:</p>
        <div className="category-selector">
          <div className="search-bar-section">
            <input
              type="text"
              placeholder="Search Categories..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {showDropdown && !loading && !error && (
              <div className="dropdown">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.quiz_id}
                      className="dropdown-items"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.quiz_name}
                    </div>
                  ))
                ) : (
                  <div>No categories found</div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="show-quiz-name-button-container">
        <button className="show-quiz-name-button" onClick={openModal}>
          Show All Quiz Names
        </button>
      </div>
        <div className="no-ques-txtbox-div">
            <p>Enter the number of questions to be played:</p>
            <input
              type="text"
              placeholder="Enter number of questions to be played"
              value={numOfQues}
              onChange={handleNumOfQuesInpt}
            />       
        </div>

        <div className="set-proficiency-level-div">
          <p>Enter the percentage of questions to be played from different proficieny level:</p>
          <div className="proficiency-lev-inpts-sec">
            <div>
              <label htmlFor="beg-inpt">Beginner</label>
              <input 
                className="proficiency-lev-inpts"
                id="beg-inpt"
                type="text"
                placeholder="Enter beginner percentage"
                value={quesProficiencyPerMap.get('beg')}
                onChange={handleBegProficInptChange}
              />
            </div>
            <div>
              <label htmlFor="imed-inpt">Intermediate</label>
              <input 
                className="proficiency-lev-inpts"
                id="imed-inpt"
                type="text"
                placeholder="Enter intermediate percentage"
                value={quesProficiencyPerMap.get('imed')}
                onChange={handleImedProficInptChange}
              />
            </div>
            <div>
              <label htmlFor="adv-inpt">Advanced</label>
              <input 
                className="proficiency-lev-inpts"
                id="adv-inpt"
                type="text"
                placeholder="Enter advanced percentage"
                value={quesProficiencyPerMap.get('adv')}
                onChange={handleAdvProficInptChange}
              />
            </div>
          </div>
        </div>

        <button className="start-quiz-button" onClick={handleStartQuiz}>
          Start Quiz
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
        <h2>All Quiz Names</h2>
        <div className="modal-categories">
          {categories.map((category) => (
            <div
              key={category.quiz_id}
              className="modal-category-name"
              onClick={() => {
                handleCategorySelect(category);
                closeModal();
              }}
            >
              {category.quiz_name}
            </div>
          ))}
        </div>
        <button className="close-button" onClick={() => setIsModalOpen(false)}>
          Close
        </button>
      </Modal>
    </>
  );
};

export default UserHome;
