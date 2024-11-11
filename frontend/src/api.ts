import axios from 'axios';

// Set the base URL for your API, replace with actual backend URL.
const API_URL = 'http://localhost:5000/api';

// Define Types for Player, Team, and Match, change based on backend models
export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  teamId: number;
}

export interface Team {
  id: number;
  name: string;
  coach: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  gamesPlayed: number;
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeScore: number;
  awayScore: number;
  date: string;
}

// Create API functions
export const getPlayers = async (): Promise<Player[]> => {
  const response = await axios.get(`${API_URL}/players`);
  return response.data;
};

export const getTeams = async (): Promise<Team[]> => {
  const response = await axios.get(`${API_URL}/teams`);
  return response.data;
};

export const getMatches = async (): Promise<Match[]> => {
  const response = await axios.get(`${API_URL}/matches`);
  return response.data;
};
