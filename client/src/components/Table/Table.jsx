import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

function Table() {
  const [topStudents, setTopStudents] = useState([]);

  useEffect(() => {
    axios.get('/api/top-students')
      .then(response => setTopStudents(response.data))
      .catch(error => console.error('Error fetching top students:', error));
  }, []);

  return (
    <div>
      <h1>Top 5 Students</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Marks Obtained</th>
          </tr>
        </thead>
        <tbody>
          {topStudents.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.marks_obtained}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;