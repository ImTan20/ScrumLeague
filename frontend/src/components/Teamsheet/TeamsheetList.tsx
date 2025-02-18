import React, { useState, useEffect } from "react";
import { getTeamsheets, deleteTeamsheet } from "../../services/TeamsheetService";
import { Teamsheet } from "../../types";
import CustomButton from "../Custombutton/CustomButton";
import { Empty, message, Space, Spin, Table, Typography } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const {Title} = Typography;

const TeamsheetList: React.FC<{ switchToPage: (teamsheet?: Teamsheet) => void }> = ({ switchToPage }) => {
    const [teamsheets, setTeamsheets] = useState<Teamsheet[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 
    useEffect(() => {
        const fetchTeamsheets = async () => {
            try {
                const teamsheetsData = await getTeamsheets();
                const actualTeamsheets = Array.isArray(teamsheetsData)
                    ? teamsheetsData
                    : (teamsheetsData as { value: Teamsheet[] })?.value || []; // Handle possible data wrapping
                setTeamsheets(actualTeamsheets);
            } catch (error) {
                console.error("Error fetching teamsheets:", error);
                setTeamsheets([]); // Fallback to empty state
            }
            finally {
                setLoading(false); // Stop loading
            }
        };

        fetchTeamsheets();
    }, []);

    const handleDeleteTeamsheet = async (id: number) => {
        try {
            await deleteTeamsheet(id);
            setTeamsheets((prev) => prev.filter((ts) => ts.id !== id));
            message.success("Teamsheet Deleted!");
        } catch (error) {
            if (process.env.NODE_ENV === "development"){
                console.error("Error deleting teamsheet:", error);
                message.error("Failed to Delete Teamsheet.");
            }
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a: Teamsheet, b: Teamsheet) => a.id - b.id,
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: string, record: Teamsheet) => (
                <Space size="middle">
                    <CustomButton type="edit" label="Edit Teamsheet" onClick={() => switchToPage(record)} />
                    <CustomButton type="delete" label="Delete Teamsheet" onClick={() => handleDeleteTeamsheet(record.id)} />
                </Space>
            ),
        },
    ];


    return (
        <div className="app-content">
            <Title level={2}>Teamsheets</Title>
            <div className="add-button-container">
            <CustomButton type="add" label="Add New Teamsheet" onClick={() => switchToPage()}></CustomButton>
            </div>

            {loading ? (
                <div>
                    <Spin indicator={<LoadingOutlined spin />} />
                </div>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={teamsheets} 
                    rowKey="id" 
                    pagination={{
                        defaultPageSize: 50,
                        showSizeChanger:true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    
                    locale={{
                        emptyText: <Empty description="No teamsheets available." />,
                    }}
                />
            )}
        </div>
    );
};

export default TeamsheetList;
