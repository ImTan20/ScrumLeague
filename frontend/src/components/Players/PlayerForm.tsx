import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Select, Button } from "antd";
import { Player, Team } from "../../types";
import { getTeams } from "../../services/TeamService";
import CustomButton from "../Custombutton/CustomButton";

interface PlayerFormProps {
  initialData: Player | null;
  onSave: (playerData: Player) => void;
  isEditMode: boolean;
  isVisible: boolean; // Control modal visibility
  onClose: () => void; // Handle closing modal
}
const Positions = [
  "FULL BACK(1)", "RIGHT WING(2)", "RIGHT CENTRE(3)", "LEFT CENTRE(4)", "LEFT WING(5)",
  "STAND OFF(6)", "SCRUM HALF(7)", "PROP(8)", "HOOKER(9)", "PROP(10)",
  "SECOND ROW(11)", "SECOND ROW(12)", "LOOSE FORWARD(13)","INTERCHANGE(14)", "INTERCHANGE(15)", "INTERCHANGE(16)", "INTERCHANGE(17)" 
];

const PlayerForm: React.FC<PlayerFormProps> = ({
  initialData,
  onSave,
  isEditMode,
  isVisible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState<Team[]>([]);

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
    if (isVisible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields(); // Reset if adding a new player
      }
    }
  }, [initialData, form, isVisible]);

  const handleFinish = (values: Player) => {
    onSave({ ...values, id: initialData ? initialData.id : 0 }); // Maintain ID when editing
    onClose(); // Close modal after saving
  };

  return (
    <Modal
      title={isEditMode ? "Edit Player" : "Add New Player"}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <CustomButton type="cancel" key="cancel" label="Cancel" onClick={onClose} ></CustomButton>,
        <CustomButton type="save" label={isEditMode ? "Update Player" : "Create Player"} onClick={() => form.submit()}></CustomButton>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          firstName: "",
          lastName: "",
          position: "",
          tries: 0,
          tackles: 0,
          carries: 0,
          teamId: 8, // Default to FreeAgent team
        }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: "Position is required" }]}
        >
          <Select placeholder="Select position">
            {Positions.map((position) => (
              <Select.Option key={position} value={position}>
                {position}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tries" label="Tries">
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item name="tackles" label="Tackles">
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item name="carries" label="Carries">
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item name="teamId" label="Team">
          <Select>
            <Select.Option value={8}>FreeAgent</Select.Option>
            {teams
              .filter((team) => team.id !== 8)
              .map((team) => (
                <Select.Option key={team.id} value={team.id}>
                  {team.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlayerForm;
