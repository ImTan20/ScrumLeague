import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Prepare graph data
  const graphData = [
    { name: 'Wins', value: teamData.teamStats.wins },
    { name: 'Losses', value: teamData.teamStats.losses },
    { name: 'Draws', value: teamData.teamStats.draws },
    { name: 'Points', value: teamData.teamStats.points },
    { name: 'Games Played', value: teamData.teamStats.gamesPlayed },
  ];

  return (
    <div>
      <h2>Team Stats</h2>
      <p>Wins: {teamData.teamStats.wins}</p>
      <p>Losses: {teamData.teamStats.losses}</p>
      <p>Draws: {teamData.teamStats.draws}</p>
      <p>Points: {teamData.teamStats.points}</p>
      <p>Games Played: {teamData.teamStats.gamesPlayed}</p>

      <h3>Combined Player Stats</h3>
      <p>Total Tries: {teamData.playerStats.totalTries}</p>
      <p>Total Tackles: {teamData.playerStats.totalTackles}</p>
      <p>Total Carries: {teamData.playerStats.totalCarries}</p>

      {/* Graph Component */}
    </div>
  );
};

export default TeamStats;
