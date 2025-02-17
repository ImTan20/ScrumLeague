import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import { Match } from "../../types";
import { getTeams } from "../../services/TeamService";
import CustomButton from "../Custombutton/CustomButton";

interface MatchFormProps {
  isVisible: boolean;
  onClose: () => void;
  initialData: Match | null;
  onSave: (matchData: Omit<Match, "id">, id?: number) => void;
  isEditMode: boolean;
  getTeamNameById: (id: number) => string;
}

const MatchForm: React.FC<MatchFormProps> = ({
  isVisible,
  onClose,
  initialData,
  onSave,
  isEditMode,
  getTeamNameById,
}) => {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsData = await getTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (isVisible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [initialData, form, isVisible]);

  const handleFinish = (values: Omit<Match, "id">) => {
    onSave(values);
    onClose(); // Close modal
  };

  return (
    <Modal
      title={isEditMode ? "Edit Match" : "Add New Match"}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <CustomButton key="cancel" type="cancel" label="Cancel" onClick={onClose} />,
        <CustomButton key="save" type="save" label={isEditMode ? "Update Match" : "Create Match"} onClick={() => form.submit()} />,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="date" label="Match Date" rules={[{ required: true, message: "Match date is required" }]}>
          <Input type="date" />
        </Form.Item>

        <Form.Item name="homeTeamId" label="Home Team" rules={[{ required: true, message: "Home team is required" }]}>
          <Select placeholder="Select Home Team">
            {teams.map((team) => (
              <Select.Option key={team.id} value={team.id}>
                {getTeamNameById(team.id)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="awayTeamId" label="Away Team" rules={[{ required: true, message: "Away team is required" }]}>
          <Select placeholder="Select Away Team">
            {teams.map((team) => (
              <Select.Option key={team.id} value={team.id}>
                {getTeamNameById(team.id)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="homeScore" label="Home Score">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="awayScore" label="Away Score">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MatchForm;
