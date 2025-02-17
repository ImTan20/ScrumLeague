import React, { useState, useEffect } from 'react';
import { getTeams } from '../../services/TeamService';
import { getPlayersByTeam } from '../../services/PlayerService';
import { createTeamsheet, updateTeamsheet } from '../../services/TeamsheetService';
import { Team, Player, Teamsheet } from '../../types';
import './TeamsheetPage.css'; // For custom drag-and-drop styling
import { message, Select, Typography, Card } from "antd";
import CustomButton from '../Custombutton/CustomButton';

const { Title } = Typography;
const { Option } = Select;
interface TeamsheetPageProps {
    switchToList: () => void;
    editingTeamsheet: Teamsheet | null;
}
const TeamsheetPage: React.FC<TeamsheetPageProps> = ({ switchToList, editingTeamsheet }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(
        editingTeamsheet ? editingTeamsheet.teamId : null
    );
    const [teamsheet, setTeamsheet] = useState<{ playerId: number; assignedPosition: string }[]>([]
    );
    const [positions, setPositions] = useState<string[]>([
        "FULL BACK(1)", "RIGHT WING(2)", "RIGHT CENTRE(3)", "LEFT CENTRE(4)", "LEFT WING(5)",
        "STAND OFF(6)", "SCRUM HALF(7)", "PROP(8)", "HOOKER(9)", "PROP(10)",
        "SECOND ROW(11)", "SECOND ROW(12)", "LOOSE FORWARD(13)",
    ]);

    const [interchangePositions, setInterchangePositions] = useState<string[]>([
        "INTERCHANGE(14)", "INTERCHANGE(15)", "INTERCHANGE(16)", "INTERCHANGE(17)"
    ]);

    const [visiblePlayers, setVisiblePlayers] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchTeams = async () => {
            const teamsData = await getTeams();
            setTeams(teamsData);
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            const fetchPlayers = async () => {
                const playersData = await getPlayersByTeam(selectedTeam);
                setPlayers(playersData);

                if (editingTeamsheet) {
                    const loadedTeamsheet = (editingTeamsheet?.players as any)?.$values.map((p: { playerId: any; assignedPosition: any; }) => ({
                        playerId: p.playerId,
                        assignedPosition: p.assignedPosition,
                    })) ?? []
                    setTeamsheet(loadedTeamsheet);
                    const assignedPlayerIds = new Set((editingTeamsheet?.players as any)?.$values.map((p: { playerId: any; }) => p.playerId));
                    setVisiblePlayers(
                        new Set(playersData.map((p) => p.id).filter((id) => !assignedPlayerIds.has(id)))
                    );
                } else {
                    setVisiblePlayers(new Set(playersData.map((p) => p.id)));
                }
            };
            fetchPlayers();
        }
    }, [selectedTeam, editingTeamsheet]);

    const handleTeamChange = async (teamId: number) => {
        setSelectedTeam(teamId);
        const playersData = await getPlayersByTeam(teamId);
        setPlayers(playersData);
        setTeamsheet([]); // Reset teamsheet when switching teams
        setVisiblePlayers(new Set(playersData.map((p) => p.id)));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player) => {
        e.dataTransfer.setData("player", JSON.stringify(player));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, position: string) => {
        const playerData = e.dataTransfer.getData("player");
        const player = JSON.parse(playerData) as Player;

        if (teamsheet.some((entry) => entry.assignedPosition === position)) return;

        setTeamsheet((prev) => [
            ...prev,
            { playerId: player.id, assignedPosition: position },
        ]);

        setVisiblePlayers((prev) => {
            const newVisiblePlayers = new Set(prev);
            newVisiblePlayers.delete(player.id);
            return newVisiblePlayers;
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handlePlayerClick = (position: string) => {
        const playerToRemove = teamsheet.find((entry) => entry.assignedPosition === position);

        if (playerToRemove) {
            setTeamsheet((prev) => prev.filter((entry) => entry.assignedPosition !== position));

            setVisiblePlayers((prev) => new Set(prev.add(playerToRemove.playerId)));
        }
    };

    const getPlayer = (position: string) => {
        return players.find(
            (p) =>
                p.id ===
                teamsheet?.find((entry) => entry.assignedPosition === position)?.playerId
        )
    }

    const saveTeamsheet = async () => {
        if (selectedTeam) {
            const newTeamsheet: Omit<Teamsheet, 'id'> = {
                teamId: selectedTeam,
                players: teamsheet.map((entry) => ({
                    teamId: selectedTeam,
                    playerId: entry.playerId,
                    assignedPosition: entry.assignedPosition,
                })),
                team: undefined,
            };

            try {
                if (editingTeamsheet && editingTeamsheet.id !== undefined) {
                    // Update existing teamsheet
                    await updateTeamsheet(editingTeamsheet.id, newTeamsheet);
                    message.success("Teamsheet Updated!");
                } else {
                    // Create new teamsheet
                    await createTeamsheet(newTeamsheet);
                    message.success("Teamsheet Created!");
                }
                switchToList(); // Navigate back to the list
            } catch (error) {
                console.error('Error saving teamsheet:', error);
                message.error("Failed to Save Teamsheet.");
            }
        }
    };

    return (
        <div className="teamsheet-container">
            <Title level={2}>{editingTeamsheet ? "Edit Teamsheet" : "Create Teamsheet"}</Title>
            <div className="teamsheet-controls">

                <div className='view-button-container'>
                    <CustomButton type="view" label="View Teamsheets" onClick={switchToList} />
                </div>
            </div>
            <div className="teamsheet-layout">
                {/* Left Column - Available Players */}
                <div className="player-pool">
                    <Title level={3}> Available Players</Title>
                    <Select
                        className="teams-dropdown"
                        onChange={(value) => handleTeamChange(Number(value))}
                        value={selectedTeam || undefined}
                        disabled={!!editingTeamsheet}
                        placeholder="Select a Team"
                    >
                        {teams.map((team) => (
                            <Option key={team.id} value={team.id}>
                                {team.name}
                            </Option>
                        ))}
                    </Select>
                    {players.map((player) =>
                        visiblePlayers.has(player.id) && (
                            <Card
                                key={player.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, player)}
                                className="player-card"
                                hoverable
                                size="small"
                            >
                                <Card.Meta
                                    title={`${player.firstName} ${player.lastName}`}
                                />
                            </Card>
                        )
                    )}
                </div>

                {/* Right Column - Rugby Field + Bench */}
                <div className="teamsheet-container">
                    <div className="rugby-field">
                        <Title level={3}>Teamsheet</Title>
                        {positions.map((position) => {
                            const player = getPlayer(position);
                            return (
                                <Card
                                    key={position}
                                    className="position-slot"
                                    onDrop={(e) => handleDrop(e, position)}
                                    onDragOver={handleDragOver}
                                    onClick={() => handlePlayerClick(position)}
                                    bordered={false}
                                >
                                    {player && (
                                        <div className="player-name">
                                            {player.firstName} {player.lastName}
                                        </div>
                                    )}
                                    <strong className="position-title">{position}</strong>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="rugby-bench">
                        <Title level={3}>Interchanges</Title>
                        {interchangePositions.map((position) => {
                            const player = getPlayer(position);
                            return (
                                <Card
                                    key={position}
                                    className="position-slot"
                                    onDrop={(e) => handleDrop(e, position)}
                                    onDragOver={handleDragOver}
                                    onClick={() => handlePlayerClick(position)}
                                >
                                    {player && <div className="player-name">{player.firstName} {player.lastName}</div>}
                                    <strong className="position-title">{position}</strong>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            <CustomButton type="save" label="Save Teamsheet" onClick={saveTeamsheet} disabled={!selectedTeam || teamsheet?.length === 0} />
        </div>
    );
};

export default TeamsheetPage;