import React, { useEffect } from 'react';
import { Team } from '../../types';
import CustomButton from '../Custombutton/CustomButton';
import { Modal, Form, Input, InputNumber } from 'antd';

interface TeamFormProps {
    initialData: Team | null;
    onSave: (teamData: Omit<Team, "id">, id?: number) => void;
    isEditMode: boolean;
    isVisible: boolean;
    onClose: () => void;
}
const TeamForm: React.FC<TeamFormProps> = ({
    initialData,
    onSave,
    isEditMode,
    isVisible,
    onClose,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        // If team data is provided, populate the form for editing
        if (initialData) {
            form.setFieldsValue(initialData);
        } else {
            form.resetFields();
        }
    }, [initialData, form]);

    const handleFinish = (values: Omit<Team, "id">) => {
        onSave(values, initialData ? initialData.id : undefined);
        onClose();
    };

    return (
        <Modal
            title={isEditMode ? "Edit Team" : "Add New Team"}
            open={isVisible}
            onCancel={onClose}
            footer={[
                <CustomButton
                    type="cancel"
                    key="cancel"
                    label="Cancel"
                    onClick={onClose}
                ></CustomButton>,
                <CustomButton
                    type="save"
                    label={isEditMode ? "Update Team" : "Create Team"}
                    onClick={() => form.submit()}
                />,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    name: "",
                    coach: "",
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    points: 0,
                    gamesPlayed: 0,
                }}
            >
                <Form.Item
                    name="name"
                    label="Team Name"
                    rules={[{ required: true, message: "Team name is required" }]}
                >
                    <Input placeholder="Enter team name" />
                </Form.Item>

                <Form.Item
                    name="coach"
                    label="Coach"
                    rules={[{ required: true, message: "Coach name is required" }]}
                >
                    <Input placeholder="Enter coach name" />
                </Form.Item>

                <Form.Item name="wins" label="Wins">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="losses" label="Losses">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="draws" label="Draws">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="points" label="Points">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="gamesPlayed" label="Games Played">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TeamForm;