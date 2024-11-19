import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const graphData = [
    { name: 'Games Played', value: playerData.gamesPlayed },
    { name: 'Tries', value: playerData.tries },
    { name: 'Tackles', value: playerData.tackles },
    { name: 'Carries', value: playerData.carries },
  ];

  return (
    <div>
      <h2>Individual Player Stats</h2>
      <p>Games Played: {playerData.gamesPlayed}</p>
      <p>Tries: {playerData.tries}</p>
      <p>Tackles: {playerData.tackles}</p>
      <p>Carries: {playerData.carries}</p>

      {/* Graph Component */}
    </div>
  );
};

export default PlayerStats;
