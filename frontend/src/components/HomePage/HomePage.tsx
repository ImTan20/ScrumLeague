import React from 'react';
import { Carousel, ConfigProvider } from 'antd';
import './HomePage.css';
import { Button } from "antd";
import { TeamOutlined, UserOutlined, BarChartOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const autoplaySpeed = 6000; // 6 seconds
  const navigate = useNavigate();
  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: { arrowSize: 40 },
        },
      }}
    >
    <div>
      <Carousel className='ant-carousel'
        autoplay
        dotPosition="bottom"
        autoplaySpeed={autoplaySpeed}
        dots
        pauseOnHover={false}
        arrows
        infinite={true}
      >
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/stadium.jpg`}
            alt="Cover 1"
            className="carousel-pic"
          />
          <div className="carousel-text">
            <h2>Welcome to the Scrum League!</h2>
            <p>A sports management web application for rugby league created by Liam Tan.</p>
          </div>
        </div>
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/rugbyhuddle.jpg`}
            alt="Cover 2"
            className="carousel-pic"
          />
          <div className="carousel-text">
            <h2>Join the Game!</h2>
            <p>Sign up for the Scrum League today.</p>
            <Button icon={<UserOutlined />} className="antd-btn" variant="solid" color="primary" onClick={() => navigate("/players")}>For Players</Button>
            <Button icon={<TeamOutlined />} ghost={true} color='primary' onClick={() => navigate("/teams")} >For Teams</Button>
          </div>
        </div>
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/rugbyball.jpg`}
            alt="Cover 3"
            className="carousel-pic"
          />
          <div className="carousel-text">
            <h2>Keep up to Date!</h2>
            <p>Get all the latest match results from across the league.</p>
            <Button icon={<CalendarOutlined />} ghost={true}  onClick={() => navigate("/matches")} >Check Matches</Button>
          </div>
        </div>
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/laptop.jpg`}
            alt="Cover 4"
            className="carousel-pic"
          />
          <div className="carousel-text">
            <h2>Track your Stats!</h2>
            <p>Explore detailed player and team analytics.</p>
            <Button icon={<BarChartOutlined />} ghost={true}  onClick={() => navigate("/stats")} >View Stats</Button>
          </div>
        </div>
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/rugbygame.jpg`}
            alt="Cover 5"
            className="carousel-pic"
          />
          <div className="carousel-text">
            <h2>Build your Teamsheet!</h2>
            <p>Create and customise your ultimate 13-player lineup for matchday success.</p>
              <Button icon={<FileTextOutlined/>} ghost={true} onClick={() => navigate("/teamsheet")} >Manage Teamsheets</Button>
          </div>
        </div>
      </Carousel>
    </div>
    </ConfigProvider>
  );
};

export default HomePage;
