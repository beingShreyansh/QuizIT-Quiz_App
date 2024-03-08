import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserHistory.css";
import Navbar from "../../../components/Navbar/Navbar";
import Spinner from "../../../components/spinner/Spinner";
import NoData from "../../../assets/No-data.png";
const pageLimit = 12;
const AdminUserHistory = () => {
  const navigate = useNavigate();
  const [userHistory, setUserHistory] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch user history data from the API
    const fetchUserHistory = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/getUserHistory`,
          {
            pagination: {
              pageLimit,
              pageNumber: 1,
            },
          }
        );
        setUserHistory(response.data);
        setIsLoading(false);
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

  const handleNavigate = (userId) => {
    navigate(`/user-history/${userId}`);
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Navbar />
          <div className="user-statistics-container">
            <h2>User Statistics</h2>
            <div className="user-stats-table">
              <div className="table-row header">
                <div className="table-cell">Sr. No.</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Number of Quizzes Played</div>
                <div className="table-cell">Average Score</div>
                <div className="table-cell">Last Played on</div>
              </div>

              {userHistory.length === 0 ? (
                <div style={{ display: "flex" }}>
                  <img src={NoData} alt="No data" style={{ margin: "auto" }} />
                </div>
              ) : (
                <>
                  {userHistory.map((user, index) => (
                    <div
                      key={user.user_id}
                      className="table-row"
                      onClick={() => handleNavigate(user.user_id)}
                    >
                      <div className="table-cell">{startIndex + index + 1}</div>
                      <div className="table-cell">{user.name}</div>
                      <div className="table-cell">
                        {user.no_of_times_played}
                      </div>
                      <div className="table-cell">{user.avg_score}</div>
                      <div className="table-cell">
                        {user.last_date_played.slice(0, 10)}
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

export default AdminUserHistory;
