import React, { useState, useEffect } from 'react';
import { Match } from '../types';
import { getTeams } from '../services/TeamService';

interface MatchFormProps {
  initialData: Match | null;
  onSave: (matchData: Omit<Match, 'id'>) => void;
  isEditMode: boolean;
  getTeamNameById: (id: number) => string;
}

const MatchForm: React.FC<MatchFormProps> = ({ initialData, onSave, isEditMode, getTeamNameById }) => {
  const [matchData, setMatchData] = useState<Omit<Match, 'id'>>({
    homeTeamId: 0,
    awayTeamId: 0,
    date: '',
    homeScore: 0,
    awayScore: 0,
    result: '',
  });

  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    if (initialData) {
      setMatchData({
        homeTeamId: initialData.homeTeamId,
        awayTeamId: initialData.awayTeamId,
        date: initialData.date,
        homeScore: initialData.homeScore,
        awayScore: initialData.awayScore,
        result: initialData.result,
      });
    }
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setMatchData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: name === 'homeScore' || name === 'awayScore' ? parseInt(value) : value,
      };

      // Calculate result based on homeScore and awayScore
      const result = updatedData.homeScore > updatedData.awayScore
        ? 'Home Win'
        : updatedData.homeScore < updatedData.awayScore
        ? 'Away Win'
        : 'Draw';

      return { ...updatedData, result };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(matchData); // Pass data without 'id' for creating or updating
  };

  // Only render the form when teams are loaded
  if (teams.length === 0) {
    return <div>Loading teams...</div>; // Display a loading state while fetching teams
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Edit Match' : 'Create Match'}</h2>

      <label>
        Match Date:
        <input
          type="date"
          name="date"
          value={matchData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Home Team:
        <select name="homeTeamId" value={matchData.homeTeamId} onChange={handleChange} required>
          <option value="">Select Home Team</option>
          {/* Use getTeamNameById for both home and away team */}
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {getTeamNameById(team.id)} {/* Use getTeamNameById here */}
            </option>
          ))}
        </select>
      </label>

      <label>
        Away Team:
        <select name="awayTeamId" value={matchData.awayTeamId} onChange={handleChange} required>
          <option value="">Select Away Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {getTeamNameById(team.id)} {/* Use getTeamNameById here */}
            </option>
          ))}
        </select>
      </label>

      <label>
        Home Score:
        <input
          type="number"
          name="homeScore"
          value={matchData.homeScore}
          onChange={handleChange}
        />
      </label>

      <label>
        Away Score:
        <input
          type="number"
          name="awayScore"
          value={matchData.awayScore}
          onChange={handleChange}
        />
      </label>

      <div>
        <span>Result:</span> {matchData.result}
      </div>

      <button type="submit">{isEditMode ? 'Update Match' : 'Create Match'}</button>
    </form>
  );
};

export default MatchForm;
