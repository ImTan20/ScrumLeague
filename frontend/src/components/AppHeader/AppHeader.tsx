import React, { useMemo } from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined, TeamOutlined, UserOutlined, BarChartOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import './AppHeader.css';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation(); // Get current route

  // Function to match the selected menu key with the current route
  const selectedKey = useMemo(() => {
    if (location.pathname === "/teamsheet" || location.pathname.startsWith("/teamsheet/")) return "/teamsheet";
    if (location.pathname === "/teams" || location.pathname.startsWith("/teams/")) return "/teams";
    if (location.pathname === "/players" || location.pathname.startsWith("/players/")) return "/players";
    if (location.pathname === "/matches" || location.pathname.startsWith("/matches/")) return "/matches";
    if (location.pathname === "/stats" || location.pathname.startsWith("/stats/")) return "/stats";
    return "/";
  }, [location.pathname]);
  

  return (
    <Header className="app-header">
      <Link to="/">
        <img 
          src={`${process.env.PUBLIC_URL}/logo.png`} 
          alt="Scrum League Logo"
          className="app-logo"
        />
      </Link>

      <Menu 
        theme="light" 
        mode="horizontal" 
        selectedKeys={[selectedKey]}
        className="app-menu"
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/players" icon={<UserOutlined />}>
          <Link to="/players">Players</Link>
        </Menu.Item>
        <Menu.Item key="/teams" icon={<TeamOutlined />}>
          <Link to="/teams">Teams</Link>
        </Menu.Item>
        <Menu.Item key="/matches" icon={<CalendarOutlined />}>
          <Link to="/matches">Matches</Link>
        </Menu.Item>
        <Menu.Item key="/stats" icon={<BarChartOutlined />}>
          <Link to="/stats">Statistics</Link>
        </Menu.Item>
        <Menu.Item key="/teamsheet" icon={<FileTextOutlined />}>
          <Link to="/teamsheet">Team Sheet</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;