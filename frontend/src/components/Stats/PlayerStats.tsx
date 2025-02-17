import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Card, Col, List, Row, Typography, message } from 'antd';
import './Stats.css';
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
        borderColor: [
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
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
  // Player Card Stats
  const stats = [
    { title: 'Games Played', value: playerData.gamesPlayed },
    { title: 'Tries', value: `${playerData.tries} (${playerData.averageTries} Per Game)` },
    { title: 'Tackles', value: `${playerData.tackles} (${playerData.averageTackles} Per Game)` },
    { title: 'Carries', value: `${playerData.carries} (${playerData.averageCarries} Per Game)` }
  ];

  return (
    <div>
      <Typography.Title className='stats-title' level={3}>Individual Player Stats</Typography.Title>
      <div className='stats-container'>
        {/* Stats Card */}
        <Card title="Player Statistics" className='stats-card'>
          <List
            itemLayout="horizontal"
            dataSource={stats}
            renderItem={(item) => (
              <List.Item style={{ padding: '4px 0' }}>
                <List.Item.Meta title={item.title} description={item.value} />
              </List.Item>
            )}
          />
        </Card>

        {/* Bar Graph */}
        <div className='stats-graph'>
          <Bar data={playerStatsData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
