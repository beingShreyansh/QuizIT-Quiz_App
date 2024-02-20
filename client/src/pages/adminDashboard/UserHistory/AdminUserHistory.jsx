import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserHistory.css";
import Navbar from "../../../components/Navbar/Navbar";
<<<<<<< HEAD

const pageLimit = 12;
const AdminUserHistory = () => {
  const [userHistory, setUserHistory] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
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
      <Navbar />
      <div className="user-history-container">
        <h2>User History</h2>
        <div className="history-table">
          <div className="table-row header">
            <div className="table-cell">Quiz</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Score</div>
            <div className="table-cell">Out of</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Time Taken</div>
          </div>
          {userHistory.map((historyItem, index) => (
            <div key={index} className="table-row">
              <div className="table-cell">{index + 1}</div>
              <div className="table-cell">{historyItem.userName}</div>
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

export default AdminUserHistory;
=======
import Modal from "../../../components/Modal/Modal";



const pageLimit = 12;
const AdminUserHistory = () => {
	const [userHistory, setUserHistory] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [open, setOpen] = React.useState(false);

	useEffect(
		() => {
			// Fetch user history data from the API
			const fetchUserHistory = async () => {
				try {
					const response = await axios.post(
						`		${import.meta.env.VITE_API_URL}/admin/getUserHistory`,
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

	const handleClose = () => {
        setOpen(false);
    };
 
    const handleOpen = () => {
        setOpen(true);
    };

	return (
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
					<div className="table-row" onClick={handleOpen}>
						<div className="table-cell">1</div>
						<div className="table-cell">Shreyansh</div>
						<div className="table-cell">10</div>
						<div className="table-cell">45</div>
						<div className="table-cell">23/02/2024</div>
					</div>
					<Modal isOpen={open} onClose={handleClose}/>
				</div>
				
				{pageNumber > 1 &&
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

export default AdminUserHistory;
>>>>>>> 30cc81be6f773d9d1cafad42a8e080c0c0e3fb5b
