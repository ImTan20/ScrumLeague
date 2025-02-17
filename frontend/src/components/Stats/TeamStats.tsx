import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, Typography, List } from 'antd';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement);

interface TeamStatsProps {
  teamId: number; // Team ID passed from StatsPage
}

const TeamStats: React.FC<TeamStatsProps> = ({ teamId }) => {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teamId) {
      setLoading(true);
      setError(null);

      axios
        .get(`http://localhost:5000/api/teams/${teamId}/stats`)
        .then((response) => {
          setTeamData(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch team stats');
          setLoading(false);
        });
    }
  }, [teamId]);

  if (loading) return <div>Loading team stats...</div>;
  if (error) return <div>{error}</div>;
  if (!teamData) return <div>No data available</div>;

  // Prepare graph data for Team Stats
  const teamStatsData = {
    labels: ['Wins', 'Losses', 'Draws'],
    datasets: [
      {
        label: 'Team Stats',
        data: [
          teamData.teamStats.wins,
          teamData.teamStats.losses,
          teamData.teamStats.draws,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Wins
          'rgba(255, 99, 132, 0.6)', // Losses
          'rgba(255, 206, 86, 0.6)', // Draws
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare graph data for Combined Player Stats
  const combinedPlayerStatsData = {
    labels: ['Total Tries', 'Total Tackles', 'Total Carries'],
    datasets: [
      {
        label: 'Player Stats',
        data: [
          teamData.playerStats.totalTries,
          teamData.playerStats.totalTackles,
          teamData.playerStats.totalCarries,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
      {
        label: 'Average Stats Per Game',
        data: [
          teamData.playerStats.averageTries,
          teamData.playerStats.averageTackles,
          teamData.playerStats.averageCarries
        ],
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

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Combined Player Stats',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Team Performance Stats',
      },
    },
  };

  return (
    <div>
      <Typography.Title className='stats-title' level={3}>Team Statistics</Typography.Title>
      <div className="stats-container">
        <Card title="Team Stats" className="stats-card">
          <List
            itemLayout="horizontal"
            dataSource={[
              { title: 'Top Try Scorer', value: `${teamData.playerStats.topTryScorer?.firstName ?? 'N/A'} ${teamData.playerStats.topTryScorer?.lastName ?? ''}: ${teamData.playerStats.topTryScorer?.tries ?? 0}` },
              { title: 'Wins', value: teamData.teamStats.wins },
              { title: 'Losses', value: teamData.teamStats.losses },
              { title: 'Draws', value: teamData.teamStats.draws },
              { title: 'Points', value: teamData.teamStats.points },
              { title: 'Games Played', value: teamData.teamStats.gamesPlayed },

            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.value} />
              </List.Item>
            )}
          />
        </Card>
        {/* Pie Chart for Team Stats */}
        <div className="stats-graph">
          <Pie data={teamStatsData} options={pieChartOptions} />
        </div>
      </div>

      <Typography.Title className='stats-title' level={3}>Combined Player Statistics</Typography.Title>

      <div className="stats-container">
        {/* Player Stats Card */}
        <Card title="Player Stats" className="stats-card">
          <List
            itemLayout="horizontal"
            dataSource={[
              { title: 'Total Tries', value: `${teamData.playerStats.totalTries} (${teamData.playerStats.averageTries} Per Game)` },
              { title: 'Total Tackles', value: `${teamData.playerStats.totalTackles} (${teamData.playerStats.averageTackles} Per Game)` },
              { title: 'Total Carries', value: `${teamData.playerStats.totalCarries} (${teamData.playerStats.averageCarries} Per Game)` },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.title} description={item.value} />
              </List.Item>
            )}
          />
        </Card>
        {/* Bar graph for Combined Player Stats */}
        <div className="stats-graph">
          <Bar data={combinedPlayerStatsData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default TeamStats;
