import axios from 'axios';
import { Team } from '../types';

const API_URL = 'http://localhost:5000/api/teams';

// CRUD Operations
export const getTeams = async (): Promise<Team[]> => {
    try {
        const response = await axios.get(API_URL);
        // Ensure the data is in the expected format
        if (response.data && Array.isArray(response.data.$values)) {
            return response.data.$values;
        } else {
            console.error('Teams data is not in the expected format:', response.data);
            return []; // Return an empty array if the format is unexpected
        }
    } catch (error) {
        console.error('Error fetching teams:', error);
        return []; // Return an empty array in case of error
    }
};



export const createTeam = async (teamData: Omit<Team, 'id'>): Promise<Team> => {
    try {
        const response = await axios.post(API_URL, teamData); // No need for /teams
        return response.data;
    } catch (error) {
        console.error('Error creating team:', error);
        throw error;
    }
};

export const updateTeam = async (id: number, teamData: Omit<Team, 'id'>): Promise<Team> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, teamData); // Correct URL format for updating a team
        return response.data;
    } catch (error) {
        console.error(`Error updating team with id ${id}:`, error);
        throw error;
    }
};

export const deleteTeam = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`); // Correct URL format for deleting a team
    } catch (error) {
        console.error('Error deleting team:', error);
        throw error;
    }
};
