import axios from 'axios';
import { Player } from '../types';

const API_URL = 'http://localhost:5000/api/players';

// CRUD Operations

// Define the structure of the API response
interface ApiResponse {
    $values: Player[];  // The field containing the array of players
  }
  
  export const getPlayers = async (): Promise<Player[]> => {
    try {
      const response = await axios.get<ApiResponse>(API_URL);  // We use ApiResponse as the expected type
      return response.data.$values;  // Access the $values field in the response
    } catch (error) {
      console.error('Error fetching players:', error);
      throw new Error('Error fetching players');
    }
  };


  export const getPlayersByTeam = async (teamId: number): Promise<Player[]> => {
    try {
        const response = await axios.get(`${API_URL}?teamId=${teamId}`);
        const data = response.data;

        // Check if $values exists, then return the array inside $values
        if (data && data.$values) {
            return data.$values.filter((player: Player) => player.teamId === teamId); // Filter players by teamId
        }

        // If no $values, just return the data directly (in case it's a direct array of players)
        return data;
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
