import axios from 'axios';
import { Match } from '../types';

const API_URL = 'http://localhost:5000/api/matches';

// CRUD Operations

export const getMatches = async (): Promise<Match[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};

export const createMatch = async (matchData: Omit<Match, 'id'>): Promise<Match> => {
    try {
        const response = await axios.post(API_URL, matchData);
        return response.data; // Return the newly created match data
    } catch (error) {
        console.error('Error creating match:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};

export const updateMatch = async (id: number, matchData: Omit<Match, 'id'>): Promise<Match> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, matchData);
        return response.data; // Return the updated match data
    } catch (error) {
        console.error(`Error updating match with id ${id}:`, error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};

export const deleteMatch = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting match with id ${id}:`, error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};
