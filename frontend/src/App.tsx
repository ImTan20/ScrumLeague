import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerList from './components/Players/PlayerList';
import TeamList from './components/Teams/TeamList';
import MatchList from './components/Matches/MatchList';
import HomePage from './components/HomePage/HomePage';
import './App.css';
import StatsPage from './components/Stats/StatsPage';
import TeamsheetManager from './components/Teamsheet/TeamsheetManager';
import TeamsheetPage from './components/Teamsheet/TeamsheetPage';
import { Teamsheet } from './types';
import "antd/dist/reset.css";
import AppHeader from './components/AppHeader/AppHeader';
import { Layout } from 'antd';

const { Content } = Layout;

const App: React.FC = () => {
  const [editingTeamsheet, setEditingTeamsheet] = useState<Teamsheet | null>(null);

  const switchToList = () => {
      setEditingTeamsheet(null);
  };
  return (
    <Router>
    <Layout style={{ minHeight: "100vh" }}>
        <AppHeader />
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<PlayerList />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/matches" element={<MatchList />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/teamsheet" element={<TeamsheetManager />} />
            <Route path="/teamsheet/:id" element={<TeamsheetPage switchToList={switchToList} 
            editingTeamsheet={editingTeamsheet}  />} />
          </Routes>
          </Content>
          </Layout>
    </Router>
  );
};

export default App;
