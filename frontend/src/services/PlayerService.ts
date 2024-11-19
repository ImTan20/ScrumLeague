import axios from 'axios';
import { Player } from '../types';

const API_URL = 'http://localhost:5000/api/players';

// CRUD Operations
export const getPlayers = async (): Promise<Player[]> => {
    try {
        const response = await axios.get(API_URL); // No additional /players
        return response.data;
    } catch (error) {
        console.error('Error fetching players:', error);
        throw error;
    }
};

export const createPlayer = async (playerData: Player): Promise<Player> => {
    try {
        const response = await axios.post(API_URL, playerData); // No additional /players
        return response.data;
    } catch (error) {
        console.error('Error creating player:', error);
        throw error;
    }
};

export const updatePlayer = async (id: number, playerData: Player): Promise<Player> => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, playerData); // No additional /players
        return response.data;
    } catch (error) {
        console.error(`Error updating player with id ${id}:`, error);
        throw error;
    }
};

export const deletePlayer = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`); // No additional /players
    } catch (error) {
        console.error('Error deleting player:', error);
        throw error;
    }
};
