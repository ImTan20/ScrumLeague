import React, { useState, useEffect, FormEvent } from 'react';
import { Team } from '../types';

interface TeamFormProps {
    team?: Team | null;
    onSubmit: (teamData: Omit<Team, 'id'>, id?: number) => void;  // Pass id for edit mode
    isEditMode: boolean;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onSubmit, isEditMode }) => {
    const [formData, setFormData] = useState<Omit<Team, 'id'>>({
        name: '',
        coach: '',
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        gamesPlayed: 0,
        players: [],
    });

    useEffect(() => {
        if (team) {
            // If team data is provided, populate the form for editing
            setFormData({
                name: team.name,
                coach: team.coach,
                wins: team.wins,
                losses: team.losses,
                draws: team.draws,
                points: team.points,
                gamesPlayed: team.gamesPlayed,
                players: team.players,
            });
        }
    }, [team]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'wins' || name === 'losses' || name === 'draws' || name === 'points' || name === 'gamesPlayed' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (team && team.id) {
            // If we are editing, pass the team ID and the form data (without 'id' field)
            onSubmit(formData, team.id);  // Pass the team ID for editing
        } else {
            // If we are creating a new team, just pass the form data
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{team ? 'Edit Team' : 'Add New Team'}</h2>

            <label>
                Team Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Coach:
                <input
                    type="text"
                    name="coach"
                    value={formData.coach}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Wins:
                <input
                    type="number"
                    name="wins"
                    value={formData.wins}
                    onChange={handleChange}
                />
            </label>

            <label>
                Losses:
                <input
                    type="number"
                    name="losses"
                    value={formData.losses}
                    onChange={handleChange}
                />
            </label>

            <label>
                Draws:
                <input
                    type="number"
                    name="draws"
                    value={formData.draws}
                    onChange={handleChange}
                />
            </label>

            <label>
                Points:
                <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                />
            </label>

            <label>
                Games Played:
                <input
                    type="number"
                    name="gamesPlayed"
                    value={formData.gamesPlayed}
                    onChange={handleChange}
                />
            </label>

            <button type="submit">{isEditMode? 'Update Team' : 'Create Team'}</button>
        </form>
    );
};

export default TeamForm;
