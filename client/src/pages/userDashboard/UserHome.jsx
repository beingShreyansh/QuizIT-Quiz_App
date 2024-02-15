import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./UserHome.css";

const UserHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const categories= ['Docker', 'AWS', 'Azure'];
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setSearchTerm("");
    setShowDropdown(false);
    // Handle category selection logic here
    console.log(`Selected category: ${category}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
  const handleStartQuiz = () => {
    // Implement logic to start quiz for the selected category
    console.log(`Starting quiz for category: ${selectedCategory}`);
  };


  return (
    <>
      <Navbar />
      <div className="user-home-container">
        <h2>Welcome to QuizIT!</h2>
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
        <button
          className="start-quiz-button"
          onClick={handleStartQuiz}
          disabled={!selectedCategory}
        >
          Start Quiz
        </button>
      </div>
    </>
  );
};

export default UserHome;
