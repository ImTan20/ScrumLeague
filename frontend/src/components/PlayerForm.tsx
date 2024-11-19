import React, { useState, useEffect } from 'react';
import { Player, Team } from '../types';
import { getTeams } from '../services/TeamService';

interface PlayerFormProps {
  initialData: Player | null;
  onSave: (playerData: Player) => void;
  isEditMode: boolean;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ initialData, onSave, isEditMode }) => {
  const [playerData, setPlayerData] = useState<Player>({
    id: 0,
    firstName: '',
    lastName: '',
    position: '',
    tries: 0,
    tackles: 0,
    carries: 0,
    teamId: 8  // Default to "FreeAgent" team (id = 8)
  });

  const [teams, setTeams] = useState<Team[]>([]);  // Store the list of teams

  // Fetch teams when the component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();  // Fetch teams from the API
        setTeams(teamsData);  // Set the teams in the state
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();

    if (initialData) {
      setPlayerData(initialData);  // Populate the form with player data when editing
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setPlayerData((prevState) => ({
      ...prevState,
      [name]: name === 'tries' || name === 'tackles' || name === 'carries' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all required fields have values
    if (
      playerData.firstName &&
      playerData.lastName &&
      playerData.position &&
      playerData.teamId &&
      playerData.tries >= 0 &&
      playerData.tackles >= 0 &&
      playerData.carries >= 0
    ) {
      onSave(playerData);  // Call onSave passed from parent
    } else {
      alert('Please fill all required fields with valid data.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={playerData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        name="lastName"
        value={playerData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        name="position"
        value={playerData.position}
        onChange={handleChange}
        placeholder="Position"
        required
      />
      <input
        type="number"
        name="tries"
        value={playerData.tries}
        onChange={handleChange}
        placeholder="Tries"
        min={0}
        required
      />
      <input
        type="number"
        name="tackles"
        value={playerData.tackles}
        onChange={handleChange}
        placeholder="Tackles"
        min={0}
        required
      />
      <input
        type="number"
        name="carries"
        value={playerData.carries}
        onChange={handleChange}
        placeholder="Carries"
        min={0}
        required
      />
      
      {/* Dropdown to select a team */}
      <select
        name="teamId"
        value={playerData.teamId}
        onChange={handleChange}
        required
      >
        <option value={8}>FreeAgent</option> {/* Pre-select FreeAgent as default */}
        {teams.filter(team => team.id !== 8).map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <button type="submit">{isEditMode ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default PlayerForm;