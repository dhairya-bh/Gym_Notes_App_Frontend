import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseList from "../components/ExerciseList";
import {
  getExercisesByDate,
  updateWorkoutNotes,
  getWorkoutByDate,
} from "../utils/api";

const DayDetails = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateObj, setDateObj] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Parse the date properly
        const [year, month, day] = date.split("-").map(Number);
        // Create a date at noon to avoid timezone issues
        const dateObject = new Date(year, month - 1, day, 12, 0, 0);
        setDateObj(dateObject);

        // Get exercises for this date
        const exercisesData = await getExercisesByDate(dateObject);
        setExercises(exercisesData);

        // Get workout day notes
        const workoutData = await getWorkoutByDate(dateObject);
        if (workoutData) {
          setNotes(workoutData.notes || "");
        }
      } catch (error) {
        console.error("Error fetching day data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const handleExerciseAdded = async () => {
    // Refresh exercises after adding a new one
    if (dateObj) {
      const exercisesData = await getExercisesByDate(dateObj);
      setExercises(exercisesData);
    }
  };

  const handleExerciseDeleted = async (deletedId) => {
    // Remove deleted exercise from state
    setExercises(exercises.filter((ex) => ex._id !== deletedId));
  };

  const handleSaveNotes = async () => {
    try {
      await updateWorkoutNotes(dateObj, notes);
      alert("Notes saved successfully!");
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes");
    }
  };

  const formattedDate = dateObj
    ? dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4 day-details">
      <button
        onClick={() => navigate("/")}
        className="btn btn-secondary mb-3 back-button"
      >
        Back to Calendar
      </button>

      <h2>{formattedDate}</h2>

      <div className="workout-notes">
        <h3>Workout Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-control mb-2"
          placeholder="Add overall notes for this workout..."
          rows="3"
        ></textarea>
        <button onClick={handleSaveNotes} className="btn btn-primary">
          Save Notes
        </button>
      </div>

      <div className="row">
        <div className="full-width">
          <ExerciseList
            exercises={exercises}
            onExerciseDeleted={handleExerciseDeleted}
          />
        </div>
      </div>

      <div className="row">
        <div className="full-width">
          <ExerciseForm date={dateObj} onExerciseAdded={handleExerciseAdded} />
        </div>
      </div>
    </div>
  );
};

export default DayDetails;
