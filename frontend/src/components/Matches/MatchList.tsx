import React, { useEffect, useState } from 'react';
import { getMatches, createMatch, updateMatch, deleteMatch } from '../../services/MatchService';
import { getTeams } from '../../services/TeamService';
import { Match, Team } from '../../types';
import MatchForm from './MatchForm';
import CustomButton from '../Custombutton/CustomButton';
import { Table, Typography, Space, Spin, Empty, message } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  // Fetch matches and teams when component mounts
  useEffect(() => {
    const fetchMatchesAndTeams = async () => {
      try {
        const [matchesData, teamsData] = await Promise.all([getMatches(), getTeams()]);
        setMatches(matchesData);
        setTeams(teamsData);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching data.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchMatchesAndTeams();
  }, []);

  const openCreateForm = () => {
    setIsFormOpen(true);
    setSelectedMatch(null); // No match selected for create
    setEditMode(false); // In create mode
  };

  const openEditForm = (match: Match) => {
    setIsFormOpen(true);
    setSelectedMatch(match); // Set the match data for editing
    setEditMode(true); // In edit mode
  };

  const handleSaveMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      if (editMode && selectedMatch) {
        const updatedMatchData: Match = { id: selectedMatch.id, ...matchData };
        await updateMatch(selectedMatch.id, updatedMatchData);
        message.success("Match Updated!");
      } else {
        await createMatch(matchData);
        message.success("Match Created!");
      }

      // Full refetch to get latest data
      const updatedMatches = await getMatches();
      setMatches(updatedMatches);

      setIsFormOpen(false);
      setEditMode(false);
      setSelectedMatch(null);
    } catch (error) {
      message.error("Failed to Save Match.");
    }
  };

  const formatDateForDisplay = (dbDate: string) => {
    if (!dbDate) return "";
    const [year, month, day] = dbDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDeleteMatch = async (id: number) => {
    try {
      await deleteMatch(id);
      message.success("Match Deleted!");
      setMatches((prevMatches) => prevMatches.filter((match) => match.id !== id));
    } catch (error) {
      message.error("Failed to Delete Match.");
    }
  };

  const getTeamNameById = (id: number) => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : 'Unknown';
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Match, b: Match) => a.date.localeCompare(b.date),
      render: (date: string) => formatDateForDisplay(date),
    },
    {
      title: 'Home Team',
      dataIndex: 'homeTeamId',
      key: 'homeTeamId',
      sorter: (a: Match, b: Match) => getTeamNameById(a.homeTeamId).localeCompare(getTeamNameById(b.homeTeamId)),
      render: (homeTeamId: number) => getTeamNameById(homeTeamId),
    },
    {
      title: 'Away Team',
      dataIndex: 'awayTeamId',
      key: 'awayTeamId',
      sorter: (a: Match, b: Match) => getTeamNameById(a.awayTeamId).localeCompare(getTeamNameById(b.awayTeamId)),
      render: (awayTeamId: number) => getTeamNameById(awayTeamId),
    },
    {
      title: 'Score',
      key: 'score',
      render: (_: any, record: Match) => `${record.homeScore} - ${record.awayScore}`,
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Match) => (
        <Space>
          <CustomButton type="edit" label="Edit Match" onClick={() => openEditForm(record)} />
          <CustomButton type="delete" label="Delete Match" onClick={() => handleDeleteMatch(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div className='app-content'>
      <Title level={2}>Matches</Title>
      <div className='add-button-container'>
        <CustomButton type="add" label="Add New Match" onClick={openCreateForm}></CustomButton>
      </div>
      {isFormOpen && (
        <MatchForm
          isVisible={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          initialData={selectedMatch}
          onSave={handleSaveMatch}
          isEditMode={editMode}
          getTeamNameById={getTeamNameById}
        />
      )}
      {loading ? (
        <div>
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={matches}
          rowKey='id'
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          locale={{
            emptyText: <Empty description="No matches available." />,
          }}></Table>
      )}
    </div>
  );
};

export default MatchList;
