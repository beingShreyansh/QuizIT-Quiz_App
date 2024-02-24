import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./UserHome.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserHome = () => {
  const [selectedCategory, setSelectedCategory] = useState({ quiz_id: "", quiz_name: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleCategorySelect = (category) => {
    setSearchTerm(""); 
    setShowDropdown(false);
    setSearchTerm(category.quiz_name);

    setSelectedCategory({ quiz_id: category.quiz_id, quiz_name: category.quiz_name });
  };

  const handleStartQuiz = () => {
    if (selectedCategory.quiz_id) {
      console.log(`Starting quiz for category: ${selectedCategory.quiz_name}`);
      navigate(`/quiz/${selectedCategory.quiz_id}`);
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
        console.log(response.data);
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
                      className="dropdown-item"
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
       
        <button className="start-quiz-button" onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    </>
  );
};

export default UserHome;
