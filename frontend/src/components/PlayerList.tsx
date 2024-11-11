import React, { useEffect, useState } from 'react';
import { getPlayers, Player } from '../api';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersData = await getPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };
    
    fetchPlayers();
  }, []);

  return (
    <div>
      <h2>Players List</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.firstName} {player.lastName} ({player.position})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
