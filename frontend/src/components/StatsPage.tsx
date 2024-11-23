import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PlayerStats from './PlayerStats';
import TeamStats from './TeamStats';

const StatsPage: React.FC = () => {
  const { search } = useLocation();  // Get the search part of the URL (query parameters)
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; id: number } | null>(null);

  // Use URL search params to get the player name or team name if it exists
  useEffect(() => {
    const params = new URLSearchParams(search);
    const Name = params.get('Name'); // Get the player name from the URL query parameters
    if (Name) {
      setSearchTerm(Name);
      handleSearch(Name);   // Automatically trigger the search
    }
  }, [search]); // Runs when the search query changes

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]); // Clear results if search is empty
      setSelectedEntity(null); // Also clear the selected entity if search is cleared
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/Search?query=${term}`);
      setSearchResults(response.data); // Response contains both players and teams

      // Automatically select the matching result if it exists
      const matchingResult = response.data.find((result: any) => result.name.toLowerCase() === term.toLowerCase());
      if (matchingResult) {
        handleSelectEntity(matchingResult.type.toLowerCase(), matchingResult); // Automatically select the result
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEntity = (type: string, entity: any) => {
    setSelectedEntity({ type, id: entity.id });
    setSearchTerm(entity.name); // Update the input field with the selected name
    setSearchResults([]); // Clear the dropdown once an entity is selected
  };

  return (
    <div>
      <h2>Stats Page</h2>

      {/* Search Bar */}
      <div>
        <label>
          Search:
          <input
            type="text"
            placeholder="Enter player, team"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);  // Update search term
              handleSearch(e.target.value);   // Trigger search
            }}
          />
        </label>
        {loading && <p>Loading...</p>}

        {/* Dropdown list of suggestions */}
        {searchResults.length > 0 && (
          <div style={{ border: '1px solid #ccc', maxHeight: '300px', overflowY: 'auto', marginTop: '5px' }}>
            {searchResults.map((result: any) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelectEntity(result.type.toLowerCase(), result)}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                {result.name} ({result.type})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Handling */}
      {error && <p>{error}</p>}

      {/* Show Stats */}
      {selectedEntity && selectedEntity.type === 'player' && (
        <PlayerStats playerId={selectedEntity.id} />
      )}
      {selectedEntity && selectedEntity.type === 'team' && (
        <TeamStats teamId={selectedEntity.id} />
      )}

      {/* Show "No results found" message only if no entity is selected */}
      {!selectedEntity &&
        searchTerm &&
        searchResults.length === 0 &&
        !loading && (
          <p>No results found for "{searchTerm}".</p>
        )}
    </div>
  );
};

export default StatsPage;
