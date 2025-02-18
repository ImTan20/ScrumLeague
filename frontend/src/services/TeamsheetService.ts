import axios from 'axios';
import { Teamsheet } from '../types';

const API_URL = 'https://scrumleague.azurewebsites.net/api/teamsheets';

interface ApiResponse {
  $values: Teamsheet[];  // The array of players
}

export const getTeamsheets = async (): Promise<Teamsheet[]> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    return response.data.$values;
  } catch (error) {
    console.error('Error fetching teamsheets:', error);
    throw error;
  }
};

/* Inactive
export const getTeamsheetById = async (id: number): Promise<Teamsheet> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`error getting teamsheet with id ${id}:`, error);
    throw error;
  }
};
*/
export const createTeamsheet = async (teamsheetData: Omit<Teamsheet, 'id'>): Promise<Teamsheet> => {
  try {
    const response = await axios.post(API_URL, teamsheetData);
    return response.data.values;
  } catch (error) {
    console.error('Error creating teamsheet:', error);
    throw error;
  }
};

export const updateTeamsheet = async (id: number, teamsheetData: Omit<Teamsheet, 'id'>): Promise<Teamsheet> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, teamsheetData);
    return response.data;
  } catch (error) {
    console.error(`Error updating teamsheet with id ${id}:`, error);
    throw error;
  }
};

export const deleteTeamsheet = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting teamsheet:', error);
    throw error;
  }
};