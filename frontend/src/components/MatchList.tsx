import React, { useEffect, useState } from 'react';
import { getMatches, createMatch, updateMatch, deleteMatch } from '../services/MatchService';
import { getTeams } from '../services/TeamService';
import { Match, Team } from '../types';
import MatchForm from './MatchForm';

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Fetch matches and teams when component mounts
  useEffect(() => {
    const fetchMatchesAndTeams = async () => {
      try {
        const matchesData = await getMatches();
        const teamsData = await getTeams();
        setMatches(matchesData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching matches or teams:', error);
      }
    };

    fetchMatchesAndTeams();
  }, []);

  const openCreateForm = () => {
    setIsFormOpen(true);
    setSelectedMatch(null); // No match selected for create
    setEditMode(false); // We're in create mode
  };

  const openEditForm = (match: Match) => {
    setIsFormOpen(true);
    setSelectedMatch(match); // Set the match data for editing
    setEditMode(true); // We're in edit mode
  };

  const handleSaveMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      if (editMode && selectedMatch) {
        // Update the match
        const updatedMatchData = { ...matchData, id: selectedMatch.id };
        await updateMatch(selectedMatch.id, updatedMatchData);
      } else {
        // Create a new match
        const newMatch = await createMatch(matchData);
    
        // Add the newly created match to the matches list
        setMatches([...matches, newMatch]);
      }
      // Refresh the list after save
      const matchesData = await getMatches();
      setMatches(matchesData);
      setIsFormOpen(false); // Close the form after saving
      setEditMode(false); // Reset edit mode
      setSelectedMatch(null); // Clear selected match
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleDeleteMatch = async (id: number) => {
    try {
      await deleteMatch(id);
      // Remove the deleted match from the list
      setMatches(matches.filter((match) => match.id !== id));
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const getTeamNameById = (id: number) => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : 'Unknown';
  };

  return (
    <div>
      <h2>Matches List</h2>
      <button onClick={openCreateForm}>Add New Match</button>

      {/* Conditionally render MatchForm for creating or editing */}
      {isFormOpen && (
        <MatchForm
          initialData={selectedMatch} // Pass selected match for editing or null for creating
          onSave={handleSaveMatch} // Pass handleSaveMatch to handle create or update
          isEditMode={editMode} // Pass the edit mode flag
          getTeamNameById={getTeamNameById}  // Pass the function
        />
      )}

      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.date}
            {getTeamNameById(match.homeTeamId)} vs {getTeamNameById(match.awayTeamId)} - 
            Score: {match.homeScore} - {match.awayScore}
            {match.result}
            <button onClick={() => openEditForm(match)}>Edit</button>
            <button onClick={() => handleDeleteMatch(match.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
