import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import PlayerStats from './PlayerStats';
import TeamStats from './TeamStats';
import { Typography, AutoComplete, Input } from 'antd';
import './Stats.css';

const { Title } = Typography;
const { Search } = Input;

const StatsPage: React.FC = () => {
  const { search } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; id: number } | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (term: string, isFinalSearch = false) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSelectedEntity(null);
      setLoading(false);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://scrumleague.azurewebsites.net/api/Search?query=${term}`);
      const data = response.data['$values'];

      const results = data.filter((result: any) =>
        result.name.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(results);

      if (isFinalSearch) {
        const matchingResult = results.find((result: any) => result.name.toLowerCase() === term.toLowerCase());
        if (matchingResult) {
          handleSelectEntity(matchingResult.type.toLowerCase(), matchingResult);
        } else {
          setSelectedEntity(null);
        }
      } setSearched(isFinalSearch && results.length === 0);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const Name = params.get('Name');
    if (Name) {
      setSearchTerm(Name);
      handleSearch(Name, true);
    }
  }, [search, handleSearch]);

  const handleSelectEntity = (type: string, entity: any) => {
    setSelectedEntity({ type, id: entity.id });
    setSearchTerm(entity.name);
    setSearchResults([]); // Hide suggestions after selecting
  };

  return (
    <div className='app-content'>
      <div className='title-container'>
        <Title level={2}>Statistics</Title>
      </div>
      {/* Ant Design AutoComplete Search Bar */}
      <div className='search-container'>
        <div className="search-bar-wrapper">
          <AutoComplete
            className="search-bar"
            popupClassName="custom-dropdown"
            value={searchTerm}
            onSearch={(value) => {
              setSearchTerm(value);
              handleSearch(value);
            }}
            onSelect={(value, option) => handleSelectEntity(option.type, option.data)}
            options={searchResults.map((result) => ({
              value: result.name,
              label: `${result.name} (${result.type})`,
              key: `${result.type}-${result.id}`,
              type: result.type.toLowerCase(),
              data: result,
            }))}
          >
            <Search
              placeholder="Search players or teams"
              loading={loading}
              enterButton
              onSearch={() => handleSearch(searchTerm, true)}
            />
          </AutoComplete>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show Stats After Selecting an Entity */}
      {selectedEntity?.type === 'player' && <PlayerStats playerId={selectedEntity.id} />}
      {selectedEntity?.type === 'team' && <TeamStats teamId={selectedEntity.id} />}

      {/* "No Results Found" Message */}
      {searched && searchResults.length === 0 && !loading && (
        <p className='no-results'>No results found for "{searchTerm}".</p>
      )}
    </div>
  );
};

export default StatsPage;
