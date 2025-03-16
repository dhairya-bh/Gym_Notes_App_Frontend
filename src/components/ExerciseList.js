import React from "react";
import ExerciseItem from "./ExerciseItem";

const ExerciseList = ({ exercises, onExerciseDeleted }) => {
  if (!exercises || exercises.length === 0) {
    return <p>No exercises logged for this day yet.</p>;
  }

  return (
    <div className="exercise-list">
      <h3>Exercises</h3>
      {exercises.map((exercise) => (
        <ExerciseItem
          key={exercise._id}
          exercise={exercise}
          onDeleted={onExerciseDeleted}
        />
      ))}
    </div>
  );
};

export default ExerciseList;
