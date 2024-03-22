import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserHistory.css";
import Navbar from "../../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import NoData from "../../../assets/No-data.png";

const pageLimit = 12;
const UserHistory = () => {
  let { id } = useParams();
  const [userHistory, setUserHistory] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    // Fetch user history data from the API

    const fetchUserHistory = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/getHistory/${id}`,
          {
            pagination: {
              pageLimit,
              pageNumber: 1,
            },
          }
        );
        setIsLoading(false);
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
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="user-history-container">
            <div className="history-table">
              <div className="table-row header">
                <div className="table-cell">S. No.</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Score</div>
                <div className="table-cell">Last Date Played</div>
                <div className="table-cell">Question Attempted</div>
                <div className="table-cell">Total Questions</div>
                <div className="table-cell">
                  Time Taken
                  <span style={{ fontSize: "12px", marginLeft: "5px" }}>
                    (Seconds)
                  </span>
                </div>
              </div>

              {userHistory.length === 0 ? (
                <div style={{ display: "flex" }}>
                  <img src={NoData} alt="No data" style={{ margin: "auto" }} />
                </div>
              ) : (
                <>
                  {userHistory.map((historyItem, index) => (
                    <div key={index} className="table-row">
                      <div className="table-cell">{index + 1}</div>
                      <div className="table-cell">{historyItem.quiz_name}</div>
                      <div className="table-cell">
                        {historyItem.marks_obtained}%
                      </div>
                      <div className="table-cell">
                        {historyItem.date_played.slice(0, 10)}
                      </div>
                      <div className="table-cell">
                        {historyItem.num_of_questions_attempted}
                      </div>
                      <div className="table-cell">
                        {historyItem.total_questions}
                      </div>
                      <div className="table-cell">
                        {historyItem.total_time_taken_in_sec}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            {pageNumber > 1 && (
              <div className="pagination">
                <button
                  onClick={() => goToPage(pageNumber - 1)}
                  disabled={pageNumber === 1}
                >
                  Previous
                </button>
                <span>Page {pageNumber}</span>
                <button onClick={() => goToPage(pageNumber + 1)}>Next</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserHistory;
