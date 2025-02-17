import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import './HomePage.css';
import { Button } from "antd";
import { HomeOutlined, TeamOutlined, UserOutlined, BarChartOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = 5;
  const autoplaySpeed = 6000; // 6 seconds
  const navigate = useNavigate();

  // Update the current slide index on carousel change
  const handleChange = (currentSlide: number) => {
    setCurrentIndex(currentSlide);
  };

  return (
    <div>
      <Carousel
        autoplay
        dotPosition="bottom"
        autoplaySpeed={autoplaySpeed}
        afterChange={handleChange}
        dots
        pauseOnHover={false}
      >
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/stadium.jpg`}
            alt="Cover Image 1"
            className="carousel-image"
          />
          <div className="carousel-text">
            <h2>Welcome to the Scrum League!</h2>
            <p>A sports management web application for rugby league created by Liam Tan.</p>
          </div>
        </div>
        <div className="carousel-slide">
          <img
            src={`${process.env.PUBLIC_URL}/rugbyhuddle.jpg`}
            alt="Cover Image 2"
            className="carousel-image"
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
            alt="Cover Image 3"
            className="carousel-image"
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
            alt="Cover Image 4"
            className="carousel-image"
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
            alt="Cover Image 5"
            className="carousel-image"
          />
          <div className="carousel-text">
            <h2>Build your Teamsheet!</h2>
            <p>Create and customise your ultimate 13-player lineup for matchday success.</p>
              <Button icon={<FileTextOutlined/>} ghost={true} onClick={() => navigate("/teamsheet")} >Manage Teamsheets</Button>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export default HomePage;
