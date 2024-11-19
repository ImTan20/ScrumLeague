import React, { useEffect, useState } from 'react';
import { getPlayers, deletePlayer, createPlayer, updatePlayer} from '../services/PlayerService';
import { Player } from '../types';
import PlayerForm from './PlayerForm';
import TeamList from './TeamList';
import { Link } from 'react-router-dom';

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Fetch players when component mounts
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

  const openCreateForm = () => {
    setIsFormOpen(true);
    setSelectedPlayer(null); // No player selected for create
    setEditMode(false);  // We're in create mode
  };

  const openEditForm = (player: Player) => {
    setIsFormOpen(true);
    setSelectedPlayer(player);  // Set the player data for editing
    setEditMode(true);  // We're in edit mode
  };

  const handleSavePlayer = async (playerData: Player) => {
    try {
      if (playerData.id) {
        // Update the player if an id exists (edit mode)
        await updatePlayer(playerData.id, playerData);
      } else {
        // Create a new player if no id (create mode)
        await createPlayer(playerData);
      }
      // Fetch the updated player list after save
      const playersData = await getPlayers();
      setPlayers(playersData);
      setIsFormOpen(false); // Close the form after saving
      setEditMode(false); // Reset edit mode
      setSelectedPlayer(null); // Clear selected player
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleDeletePlayer = async (id: number) => {
    try {
      await deletePlayer(id);
      // Remove the deleted player from the list
      setPlayers(players.filter((player) => player.id !== id));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  return (
    <div>
      <h2>Players List</h2>
      <button onClick={openCreateForm}>Add New Player</button>
      
      {/* Conditionally render PlayerForm for creating or editing */}
      {isFormOpen && (
        <PlayerForm
          initialData={selectedPlayer}  // Pass selected player for editing (or null for creating)
          onSave={handleSavePlayer}  // Pass handleSavePlayer to handle both create and update
          isEditMode={editMode}  // Pass the edit mode flag
        />
      )}
      
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            <Link to={`/stats?playerName=${player.firstName} ${player.lastName}`} className='App-link'>
              {player.firstName} {player.lastName}
            </Link>
            ({player.position})
            <Link to ="/" className="App-link">{player.teamId}</Link>

            <button onClick={() => openEditForm(player)}>Edit</button>
            <button onClick={() => handleDeletePlayer(player.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
