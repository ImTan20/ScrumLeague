import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2'; // Import Bar and Pie charts
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'; // Import necessary Chart.js modules

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
      backgroundColor:[
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
      <h2>Team Stats</h2>
      <p>Wins: {teamData.teamStats.wins}</p>
      <p>Losses: {teamData.teamStats.losses}</p>
      <p>Draws: {teamData.teamStats.draws}</p>
      <p>Points: {teamData.teamStats.points}</p>
      <p>Games Played: {teamData.teamStats.gamesPlayed}</p>
      <h4>Top Try Scorer </h4>
      <p>{teamData.playerStats.topTryScorer.firstName} {teamData.playerStats.topTryScorer.lastName}: {teamData.playerStats.topTryScorer.tries}</p>
      
      {/* Pie Chart for Team Stats */}
      <Pie data={teamStatsData} options={pieChartOptions} />
      <h3>Combined Player Stats</h3>
      <p>Total Tries: {teamData.playerStats.totalTries} ({teamData.playerStats.averageTries} Per Game)</p>
      <p>Total Tackles: {teamData.playerStats.totalTackles} ({teamData.playerStats.averageTackles} Per Game)</p>
      <p>Total Carries: {teamData.playerStats.totalCarries} ({teamData.playerStats.averageCarries} Per Game)</p>

      {/* Bar graph for Combined Player Stats */}
      <Bar data={combinedPlayerStatsData} options={barChartOptions} />
    </div>
  );
};

export default TeamStats;
