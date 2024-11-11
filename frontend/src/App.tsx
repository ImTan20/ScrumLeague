import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerList from './components/PlayerList';
import TeamList from './components/TeamList';
import MatchList from './components/MatchList';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>Scrum League</h1>
        <nav>
          <ul>
            <li><a href="/players">Players</a></li>
            <li><a href="/teams">Teams</a></li>
            <li><a href="/matches">Matches</a></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/players" element={<PlayerList />} />
          <Route path="/teams" element={<TeamList />} />
          <Route path="/matches" element={<MatchList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
