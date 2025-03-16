import React from "react";
import { deleteExercise } from "../utils/api";

const ExerciseItem = ({ exercise, onDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await deleteExercise(exercise._id);
        if (onDeleted) {
          onDeleted(exercise._id);
        }
      } catch (error) {
        console.error("Error deleting exercise:", error);
      }
    }
  };

  return (
    <div className="exercise-item">
      <h4>{exercise.name}</h4>

      {exercise.gifUrl && (
        <div className="exercise-gif">
          <img src={exercise.gifUrl} alt={exercise.name} width="200" />
        </div>
      )}

      <div className="sets-container">
        <h5>Sets:</h5>
        <table className="sets-table">
          <thead>
            <tr>
              <th>Set</th>
              <th>Reps</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {exercise.sets.map((set, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{set.reps}</td>
                <td>{set.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {exercise.notes && (
        <div className="exercise-notes">
          <h5>Notes:</h5>
          <p>{exercise.notes}</p>
        </div>
      )}

      <div className="exercise-actions">
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;
