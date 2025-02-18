import React, { useEffect, useState } from 'react';
import { getTeams, deleteTeam, createTeam, updateTeam } from '../../services/TeamService';
import { Team } from '../../types';
import TeamForm from './TeamForm';
import { Link } from 'react-router-dom';
import CustomButton from '../Custombutton/CustomButton';
import { Table, Typography, Space, Spin, Empty, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import "./TeamList.css";

const { Title } = Typography;

const TeamList: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch teams when component mounts
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsData = await getTeams();
                // Ensure the fetched data is an array
                if (Array.isArray(teamsData)) {
                    setTeams(teamsData);
                } else {
                    console.error('Fetched teams data is not an array:', teamsData);
                    setTeams([]); // Set empty array if data is not an array
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                setTeams([]); // Set empty array in case of error
            }
            finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const openCreateForm = () => {
        setIsFormOpen(true);
        setSelectedTeam(null);  // No team selected for create
        setEditMode(false);  // In create mode
    };

    const openEditForm = (team: Team) => {
        setIsFormOpen(true);
        setSelectedTeam(team);  // Set the team data for editing
        setEditMode(true); 
    };

    const handleDeleteTeam = async (id: number) => {
        try {
            await deleteTeam(id);
            // Remove the deleted team from the list
            setTeams(teams.filter((team) => team.id !== id));
            message.success("Team Deleted!");
        } catch (error) {
            console.error('Error deleting team:', error);
            message.error("Failed to Delete Team.");
        }
    };

    const handleSaveTeam = async (teamData: Omit<Team, 'id'>) => {
        try {
            if (selectedTeam) {
                const updatedTeamData: Team = { id: selectedTeam.id, ...teamData };
                await updateTeam(selectedTeam.id, updatedTeamData);
                message.success("Team Updated!");
            } else {
                await createTeam(teamData);
                message.success("Team Created!");
            }
            // Full refetch to get the latest data
            const updatedTeams = await getTeams();
            setTeams(updatedTeams);

            setIsFormOpen(false);
            setSelectedTeam(null);
            setEditMode(false);
        } catch (error) {
            console.error('Error saving team:', error);
            message.error("Failed to Save Team.");
        }
    };

    const columns = [
        {
            title: 'Team',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Team, b: Team) => a.name.localeCompare(b.name), 
            render: (text: string, record: Team) => (
                <Link to={`/stats?Name=${record.name}`} className="team-link">
                    {text}
                </Link>
            )
        },
        {
            title: 'Coach',
            dataIndex: 'coach',
            key: 'coach',
            sorter: (a: Team, b: Team) => a.coach.localeCompare(b.coach),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Team) => (
                <Space size="middle">
                    <CustomButton type="edit" label="Edit Team" onClick={() => openEditForm(record)} />
                    <CustomButton type="delete" label="Delete Team" onClick={() => handleDeleteTeam(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div className='app-content'>
            <Title level={2}>Teams</Title>
            <div className='add-button-container'>
                <CustomButton type="add" label="Add New Team" onClick={openCreateForm}></CustomButton>
            </div>
            {/* Conditionally render TeamForm for creating or editing */}
            {isFormOpen && (
                <TeamForm
                    initialData={selectedTeam}
                    onSave={handleSaveTeam}
                    isEditMode={editMode}
                    isVisible={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                />
            )}
            {loading ? (
                <div>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={teams}
                    rowKey='id'
                    tableLayout="fixed"
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger:true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    locale={{
                        emptyText: <Empty description="No teams available." />,
                    }} >
                </Table>
            )}
        </div>
    );
};

export default TeamList;