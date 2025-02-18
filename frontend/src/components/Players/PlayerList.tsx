import React, { useEffect, useState } from "react";
import { Table, Typography, Space, Spin, Empty, message } from "antd";
import { getPlayers, deletePlayer, createPlayer, updatePlayer } from "../../services/PlayerService";
import { getTeams } from "../../services/TeamService";
import { Player, Team } from "../../types";
import PlayerForm from "./PlayerForm";
import { Link } from "react-router-dom";
import CustomButton from "../Custombutton/CustomButton";
import { LoadingOutlined } from '@ant-design/icons';
import "./PlayerList.css";

const { Title } = Typography;

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersData = await getPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const getTeamNameById = (id: number): string => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : "Unknown";
  };
  // Modal
  const openCreateForm = () => {
    setIsFormOpen(true);
    setSelectedPlayer(null);
    setEditMode(false);
  };

  const openEditForm = (player: Player) => {
    setIsFormOpen(true);
    setSelectedPlayer(player);
    setEditMode(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPlayer(null);
  };

  const handleSavePlayer = async (playerData: Player) => {
    try {
      if (playerData.id) {
        await updatePlayer(playerData.id, playerData);
        message.success("Played Updated!");
      } else {
        await createPlayer(playerData);
        message.success("Played Created!");
      }
      const playersData = await getPlayers();
      setPlayers(playersData);
      handleCloseForm(); // Close modal after saving
    } catch (error) {
      console.error("Error Saving Player:", error);
      message.error("Failed to Save Player.");
    }
  };

  const handleDeletePlayer = async (id: number) => {
    try {
      await deletePlayer(id);
      message.success("Played Deleted!");
      setPlayers(players.filter((player) => player.id !== id));
    } catch (error) {
      console.error("Error deleting player:", error);
      message.error("Failed to Delete Player.");
    }
  };

  // Ant Design Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a:  Player, b: Player) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      render: (_: any, record: Player) => (
        <Link to={`/stats?Name=${record.firstName} ${record.lastName}`} className="player-link">
          {record.firstName} {record.lastName}
        </Link>
      ),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a: Player, b: Player) => a.position.localeCompare(b.position),
    },
    {
      title: "Team",
      dataIndex: "teamId",
      key: "teamId",
      sorter: (a: Player, b: Player) => getTeamNameById(a.teamId).localeCompare(getTeamNameById(b.teamId)),
      render: (teamId: number) => getTeamNameById(teamId),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Player) => (
        <Space size="middle">
          <CustomButton type="edit" label="Edit Player" onClick={() => openEditForm(record)} />
          <CustomButton type="delete" label="Delete Player" onClick={() => handleDeletePlayer(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="app-content">
      <Title className="" level={2}>Players</Title>
      <div className="add-button-container" >
        <CustomButton type="add" label="Add New Player" onClick={openCreateForm} />
      </div>

      {/* Ant Design Table to display players */}
      {loading ? (
        <div>
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={players}
          rowKey="id"
          tableLayout="fixed"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger:true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
          locale={{
            emptyText: <Empty description="No players available." />,
          }} />
      )}

      {/* Player Form Modal */}
      <PlayerForm
        initialData={selectedPlayer}
        onSave={handleSavePlayer}
        isEditMode={editMode}
        isVisible={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default PlayerList;
