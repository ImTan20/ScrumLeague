import React, { useEffect, useState } from 'react';
import { getMatches, Match } from '../api';

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesData = await getMatches();
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h2>Matches List</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            {match.homeTeamId} vs {match.awayTeamId} - Score: {match.homeScore} - {match.awayScore}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchList;
