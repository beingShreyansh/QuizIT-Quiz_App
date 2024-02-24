import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserHistory.css";
import Navbar from "../../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";

const pageLimit = 12;
const UserHistory = () => {
  let { userId } = useParams();
  const [userHistory, setUserHistory] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // Fetch user history data from the API
    
    const fetchUserHistory = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/getHistory/${userId}`,
          {
            pagination: {
              pageLimit,
              pageNumber: 1,
            },
          }
        );
        setUserHistory(response.data);
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    };

    fetchUserHistory();
  }, []);
  const goToPage = (pageNumber) => {
    setPageNumber(pageNumber);
  };

  const startIndex = (pageNumber - 1) * pageLimit;

  return (
    <>
      <div className="user-history-container">
        <div className="history-table">
          <div className="table-row header">
            <div className="table-cell">S. No.</div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Score</div>
            <div className="table-cell">Out of</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Time Taken</div>
          </div>
          {userHistory.map((historyItem, index) => (
            <div key={index} className="table-row">
              <div className="table-cell">{index + 1}</div>
              <div className="table-cell">{historyItem.category}</div>
              <div className="table-cell">{historyItem.score}</div>
              <div className="table-cell">{historyItem.outOf}</div>
              <div className="table-cell">{historyItem.date}</div>
              <div className="table-cell">{historyItem.timeTaken}</div>
            </div>
          ))}
        </div>
       { pageNumber > 1 &&
        <div className="pagination">
          <button
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            Previous
          </button>
          <span>Page {pageNumber}</span>
          <button onClick={() => goToPage(pageNumber + 1)}>Next</button>
        </div>}
      </div>
    </>
  );
};

export default UserHistory;
