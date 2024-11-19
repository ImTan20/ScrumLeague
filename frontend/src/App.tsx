import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayerList from './components/PlayerList';
import TeamList from './components/TeamList';
import MatchList from './components/MatchList';
import HomePage from './components/HomePage';
import './App.css';
import StatsPage from './components/StatsPage';
import TeamSheetPage from './components/TeamSheetPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        {/* Header with Logo and Navigation Links */}
        <header className="App-header">
          {/* Make the logo clickable and navigate to the homepage */}
          <Link to="/">
            <img 
              src={`${process.env.PUBLIC_URL}/logo.png`} 
              alt="Scrum League Logo" 
              className="App-logo" 
            />
          </Link>
          <nav className="App-nav">
            <Link to ="/" className="App-link">Home</Link>
            <Link to ="/players" className="App-link">Players</Link>
            <Link to ="/teams" className="App-link">Teams</Link>
            <Link to ="/matches" className="App-link">Matches</Link>
            <Link to ="/stats" className='App-link'>Stats</Link>
            <Link to ="/teamSheet" className='App-link'>Team Sheet</Link>

          </nav>
        </header>

        {/* Main Content Area */}
        <div className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayerList />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/matches" element={<MatchList />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/teamSheet" element={<TeamSheetPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
