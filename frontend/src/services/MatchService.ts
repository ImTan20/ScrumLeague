import axios from 'axios';
import { Match } from '../types';

const API_URL = 'https://scrumleague.azurewebsites.net/api/matches';

// CRUD Operations

export const getMatches = async (): Promise<Match[]> => {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;

        // Check if the data contains '$values', otherwise assume it's already an array
        return data.$values ? data.$values : data;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
};

export const createMatch = async (matchData: Omit<Match, 'id'>): Promise<Match> => {
    try {
        const response = await axios.post(API_URL, matchData);
        return response.data; // Return the newly created match data
    } catch (error) {
        console.error('Error creating match:', error);
        throw error; // Re-throw the error
    }
};

export const updateMatch = async (id: number, matchData: Omit<Match, 'id'>): Promise<Match> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, matchData);
        return response.data; // Return the updated match data
    } catch (error) {
        console.error(`Error updating match with id ${id}:`, error);
        throw error; // Re-throw the error
    }
};

export const deleteMatch = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting match with id ${id}:`, error);
        throw error; // Re-throw the error
    }
};
