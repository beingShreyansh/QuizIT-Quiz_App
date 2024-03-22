import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

function Chart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/averageScore`
      );

      // Process the data to match the expected format for the chart
      const formattedData = response.data.map(item => ({
        quiz_name: `${item.quiz_category} - ${item.quiz_name}`,
        avg_questions_attempted: item.avg_questions_attempted,
        avg_marks_obtained: item.avg_marks_obtained,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching quiz topic statistics:", error);
    }
  };

  return (
    <div>
      <h1 className="i">Quiz App Statistics</h1>
      <BarChart
        width={1000}
        height={500}
        data={data}
        margin={{ top: 20, right: 50, left: 50, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="quiz_name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avg_questions_attempted" fill="#8884d8" name="Avg Questions Attempted" />
        <Bar dataKey="avg_marks_obtained" fill="#82ca9d" name="Avg Marks Obtained" />
      </BarChart>
    </div>
  );
}

export default Chart;
