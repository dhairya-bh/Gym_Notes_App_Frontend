// src/components/ExerciseForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { createExercise } from "../utils/api";
import { searchExercises } from "../data/exerciseLibrary";

const ExerciseForm = ({ date, onExerciseAdded }) => {
  const [name, setName] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchResultsRef = useRef(null);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = searchExercises(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddSet = () => {
    setSets([...sets, { reps: "", weight: "" }]);
  };

  const handleRemoveSet = (index) => {
    const newSets = [...sets];
    newSets.splice(index, 1);
    setSets(newSets);
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const handleExerciseSelect = (exercise) => {
    setName(exercise.name);
    setGifUrl(exercise.gifUrl);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Filter out empty sets
      const validSets = sets.filter((set) => set.reps || set.weight);

      const exerciseData = {
        name,
        gifUrl,
        sets: validSets,
        notes,
        date,
      };

      await createExercise(exerciseData);

      // Reset form
      setName("");
      setGifUrl("");
      setSets([{ reps: "", weight: "" }]);
      setNotes("");

      // Notify parent component
      if (onExerciseAdded) {
        onExerciseAdded();
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  return (
    <div className="exercise-form">
      <h3>Add New Exercise</h3>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group position-relative">
          <label htmlFor="exerciseSearch">Search Exercise</label>
          <input
            type="text"
            id="exerciseSearch"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for exercises..."
          />

          {showResults && searchResults.length > 0 && (
            <div
              ref={searchResultsRef}
              className="search-results"
              style={{
                position: "absolute",
                zIndex: 1000,
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "white",
                border: "1px solid #ced4da",
                borderRadius: "0.25rem",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {searchResults.map((exercise) => (
                <div
                  key={exercise.id}
                  className="search-result-item"
                  onClick={() => handleExerciseSelect(exercise)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
                >
                  <div>
                    <strong>{exercise.name}</strong>
                  </div>
                  <div className="text-muted">
                    Body part: {exercise.bodyPart}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name">Exercise Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gifUrl">GIF URL (optional)</label>
          <input
            type="text"
            id="gifUrl"
            className="form-control"
            value={gifUrl}
            onChange={(e) => setGifUrl(e.target.value)}
            placeholder="https://example.com/exercise.gif"
          />
          {gifUrl && (
            <div className="mt-2">
              <img
                src={gifUrl}
                alt="Exercise preview"
                style={{ maxWidth: "100%", maxHeight: "150px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/150?text=Invalid+Image";
                }}
              />
            </div>
          )}
        </div>

        <div className="form-group set-inputs-container">
          <label>Sets</label>
          {sets.map((set, index) => (
            <div key={index} className="set-inputs">
              <label>Reps:</label>
              <input
                type="number"
                value={set.reps}
                onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                className="form-control"
                min="0"
              />
              <label>Weight:</label>
              <input
                type="number"
                value={set.weight}
                onChange={(e) =>
                  handleSetChange(index, "weight", e.target.value)
                }
                className="form-control"
                min="0"
                step="0.1"
              />
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSet(index)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="button-container">
            <button
              type="button"
              onClick={handleAddSet}
              className="btn btn-secondary"
            >
              Add Set
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Exercise
        </button>
      </form>
    </div>
  );
};

export default ExerciseForm;
