import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopStudentsTable.css';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

function TopStudentsTable() {
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/top-students`);
      const formattedData = response.data.map(student => ({
        name: student.name,
        avg_per:student.avg_per,
        avg_time_taken: student.avg_time_taken,
        first_played_date: formatDate(student.first_played_date),
        last_played_date: formatDate(student.last_played_date)
      }));
      setTopStudents(formattedData);
    } catch (error) {
      console.error('Error fetching top students:', error);
    }
  };

  // Function to format the date as "yyyy-mm-dd"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <div className='item'>
        <h1>Top 5 Students</h1>
        <table className='top-students-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Percentage Marks</th>
              <th>Average Time Taken (sec)</th>
              <th>First Played Date</th>
              <th>Last Played Date</th>
            </tr>
          </thead>
          <tbody>
            {topStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{Number(student.avg_per).toFixed(2)}%</td>
                <td>{student.avg_time_taken}</td>
                <td>{student.first_played_date}</td>
                <td>{student.last_played_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopStudentsTable;

