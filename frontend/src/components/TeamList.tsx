import React, { useEffect, useState } from 'react';
import { getTeams, deleteTeam, createTeam, updateTeam } from '../services/TeamService';
import { Team } from '../types';
import TeamForm from './TeamForm'; 
import { Link } from 'react-router-dom';

const TeamList: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    // Fetch teams when component mounts
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsData = await getTeams();
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchTeams();
    }, []);

    const openCreateForm = () => {
        setIsFormOpen(true);
        setSelectedTeam(null);  // No team selected for create
        setEditMode(false);  // We're in create mode
    };

    const openEditForm = (team: Team) => {
        setIsFormOpen(true);
        setSelectedTeam(team);  // Set the team data for editing
        setEditMode(true);  // We're in create mode
    };

    const handleDeleteTeam = async (id: number) => {
        try {
            await deleteTeam(id);
            // Remove the deleted team from the list
            setTeams(teams.filter((team) => team.id !== id));
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    const handleSaveTeam = async (teamData: Omit<Team, 'id'>) => {
        try {
            if (selectedTeam) {
                // Ensure the id from the selectedTeam is included in the team data for the update
                const updatedTeamData = { ...teamData, id: selectedTeam.id }; 
    
                // Update the team if selected
                await updateTeam(selectedTeam.id, updatedTeamData);  // Ensure ID in URL and teamData match
    
                // Update the teams list by modifying the team directly (for a smoother UI experience)
                setTeams(teams.map((team) => (team.id === selectedTeam.id ? { ...team, ...updatedTeamData } : team)));
            } else {
                // Create a new team
                const newTeam = await createTeam(teamData);
    
                // Add the newly created team to the teams list
                setTeams([...teams, newTeam]);
            }
            
            // Close the form after saving
            setIsFormOpen(false); 
            setSelectedTeam(null); // Clear selected team
            setEditMode(false);
        } catch (error) {
            console.error('Error saving team:', error);
        }
    };
    

    return (
        <div>
            <h2>Teams List</h2>
            <button onClick={openCreateForm}>Add New Team</button>

            {/* Conditionally render TeamForm for creating or editing */}
            {isFormOpen && (
                <TeamForm
                    team={selectedTeam}  // Pass selected team for editing (or null for creating)
                    onSubmit={handleSaveTeam}  // Pass handleSaveTeam to handle both create and update
                    isEditMode={editMode}
                />
            )}

            <ul>
                {teams.map((team) => (
                    <li key={team.id}>
                        <Link to={`/stats?Name=${team.name}`} className="App-link">
                            {team.name}
                        </Link>
                        (Coach: {team.coach})
                        <button onClick={() => openEditForm(team)}>Edit</button>
                        <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamList;
