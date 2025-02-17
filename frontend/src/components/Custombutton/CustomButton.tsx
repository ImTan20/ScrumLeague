import React from "react";
import { Button } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import "./CustomButton.css";

interface CustomButtonProps {
  type: "add" | "edit" | "delete" | "view" | "save" | "cancel" ;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

const iconMap = {
  add: <PlusOutlined />,
  edit: <EditOutlined />,
  delete: <DeleteOutlined />,
  view: <EyeOutlined />,
  save: <SaveOutlined />,
  cancel: null,
};

const CustomButton: React.FC<CustomButtonProps> = ({ type, onClick, disabled, label }) => {
  return (
    <Button
    type="primary"
      className={`custom-button ${type}-btn`} // Apply type-specific styling
      onClick={onClick}
      disabled={disabled}
      icon={iconMap[type]} // Automatically adds the right icon
    >
      {label || type.charAt(0).toUpperCase() + type.slice(1)} {/* Default label if none provided */}
    </Button>
  );
};

export default CustomButton;
