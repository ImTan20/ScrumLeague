import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Import Bar chart
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'; // Import necessary Chart.js modules

// Register the required modules for Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface PlayerStatsProps {
  playerId: number; // Player ID passed from StatsPage
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ playerId }) => {
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playerId) {
      setLoading(true);
      setError(null);

      axios
        .get(`http://localhost:5000/api/players/${playerId}/stats`)
        .then((response) => {
          setPlayerData(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch player stats');
          setLoading(false);
        });
    }
  }, [playerId]);

  if (loading) return <div>Loading player stats...</div>;
  if (error) return <div>{error}</div>;
  if (!playerData) return <div>No data available</div>;
  
  // Prepare graph data
  const playerStatsData = {
    labels: ['Tries', 'Tackles', 'Carries'], // X-axis labels
    datasets: [
      {
        label: 'Player Stats',
        data: [
          playerData.tries,
          playerData.tackles,
          playerData.carries,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Tries
          'rgba(54, 162, 235, 0.6)', // Tackles
          'rgba(255, 206, 86, 0.6)' // Carries
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
      {
        label: 'Average Stats per Game',
        data: [playerData.averageTries, playerData.averageTackles, playerData.averageCarries],
        backgroundColor: [
          'rgba(75, 192, 192, 0.3)',
          'rgba(54, 162, 235, 0.3)',
          'rgba(255, 206, 86, 0.3)'
        ],
        borderColor:[
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Legend position
      },
      title: {
        display: true,
        text: 'Player Performance Stats', // Chart title
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div>
      <h2>Individual Player Stats</h2>
      <p>Games Played: {playerData.gamesPlayed}</p>
      <p>Tries: {playerData.tries} ({playerData.averageTries} Per Game)</p>
      <p>Tackles: {playerData.tackles} ({playerData.averageTackles} Per Game)</p>
      <p>Carries: {playerData.carries} ({playerData.averageCarries} Per Game)</p>

      {/* Bar graph for Player Stats*/}
      <Bar data={playerStatsData} options={chartOptions} />
    </div>
  );
};

export default PlayerStats;
