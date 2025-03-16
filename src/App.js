import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DayDetails from "./pages/DayDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:date" element={<DayDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
