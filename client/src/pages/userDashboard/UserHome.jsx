import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./UserHome.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const categories = ["Docker", "AWS", "Azure"];
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setShowDropdown(false);
    setSelectedCategory(category);
    console.log(`Selected category: ${category}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
  const handleStartQuiz = () => {
    if (selectedCategory) {
      console.log(`Starting quiz for category: ${selectedCategory}`);
      navigate(`/quiz/${selectedCategory}`);
    } else {
      toast.error("Select a Category");
    }
  };

  return (
    <>
      <Navbar />
      <div className="user-home-container">
        <h1>Welcome to QuizIT!</h1>
        <p>Please select a category to start the quiz:</p>
        <div className="category-selector">
          <div className="search-bar-section">
            <input
              type="text"
              placeholder="Search Categories..."
              value={searchTerm}
              onChange={handleInputChange}
            />
            {showDropdown && (
              <div className="dropdown">
                {filteredCategories.map((category) => (
                  <div
                    key={category}
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="start-quiz-button" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    </>
  );
};

export default UserHome;
