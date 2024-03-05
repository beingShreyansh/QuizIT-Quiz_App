import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Chart() {
  const data = useMemo(
    () => [
      { topic: 'AWS', quizzesPlayed: 10, averageScore: 80 },
      { topic: 'Docker', quizzesPlayed: 5, averageScore: 75 },
      { topic: 'Azure', quizzesPlayed: 3, averageScore: 34 },
    ],
    []
  );

  return (
    <div>
      <h1>Quiz App Statistics</h1>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 7, right: 30, left: 30, bottom: 7 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="topic" />
        <YAxis />
        <Tooltip 
          formatter={(value, name, props) => [`${value}`, `Average Score: ${props.payload.averageScore}`]}
        />
        <Legend />
        <Bar dataKey="quizzesPlayed" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Chart;
