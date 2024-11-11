import React, { useEffect, useState } from 'react';
import { getTeams, Team } from '../api';

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    
    fetchTeams();
  }, []);

  return (
    <div>
      <h2>Teams List</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} (Coach: {team.coach})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;
