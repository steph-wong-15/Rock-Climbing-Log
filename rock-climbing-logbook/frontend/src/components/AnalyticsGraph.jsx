import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { useQuery, gql } from '@apollo/client';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement } from 'chart.js';

// Register required Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement);

const GET_CLIMB_LOGS = gql`
  query GetClimbLogs {
    climbLogs {
      id
      difficulty
      attempts
    }
  }
`;

const AnalyticsGraph = () => {
  const { loading, error, data } = useQuery(GET_CLIMB_LOGS);
  const [difficultyData, setDifficultyData] = useState([]);
  const [attemptsData, setAttemptsData] = useState([]);

  useEffect(() => {
    if (data) {
      const difficulties = {};
      const attempts = [];

      data.climbLogs.forEach((log) => {
        if (log.difficulty) {
          difficulties[log.difficulty] = (difficulties[log.difficulty] || 0) + 1;
        }
        attempts.push(log.attempts);
      });

      setDifficultyData(difficulties);
      setAttemptsData(attempts);
    }
  }, [data]);

  if (loading) return <p>Loading graphs...</p>;
  if (error) return <p>Error fetching climb logs: {error.message}</p>;

  const difficultyChartData = {
    labels: Object.keys(difficultyData),
    datasets: [
      {
        label: 'Climb Difficulty Distribution',
        data: Object.values(difficultyData),
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className="analytics-graphs">
      <div className="chart-container">
        <h3>Climb Difficulty Distribution</h3>
        <Pie data={difficultyChartData} />
      </div>

    </div>
  );
};

export default AnalyticsGraph;
