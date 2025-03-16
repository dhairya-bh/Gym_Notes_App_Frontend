import React from "react";
import GymCalendar from "../components/Calendar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleDateSelect = (date) => {
    // Format date as YYYY-MM-DD and ensure it's in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    navigate(`/day/${formattedDate}`);
  };

  return (
    <div className="home-page">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Gym Notes</h1>
      <GymCalendar onDateSelect={handleDateSelect} />
    </div>
  );
};

export default Home;
