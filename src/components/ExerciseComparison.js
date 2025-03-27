import React, { useState } from "react";
import { getExercisesByDate } from "../utils/api";

const ExerciseComparison = ({ currentDate, currentExercises }) => {
  const [compareDate, setCompareDate] = useState("");
  const [compareExercises, setCompareExercises] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => {
    setCompareDate(e.target.value);
  };

  const fetchComparisonData = async () => {
    if (!compareDate) {
      alert("Please select a date to compare with");
      return;
    }

    try {
      setLoading(true);
      const [year, month, day] = compareDate.split("-").map(Number);
      const dateObject = new Date(year, month - 1, day, 12, 0, 0);

      const exercisesData = await getExercisesByDate(dateObject);
      setCompareExercises(exercisesData);
      setIsComparing(true);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      alert("Failed to fetch comparison data");
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setIsComparing(false);
    setCompareExercises([]);
  };

  // Create a map of exercises that exist on both dates
  const getComparisonData = () => {
    const comparisonData = [];

    currentExercises.forEach((currentEx) => {
      const matchingEx = compareExercises.find(
        (ex) => ex.name === currentEx.name
      );

      if (matchingEx) {
        comparisonData.push({
          name: currentEx.name,
          current: currentEx,
          comparison: matchingEx,
        });
      }
    });

    return comparisonData;
  };

  // Get the maximum number of sets between the two exercises
  const getMaxSets = (current, comparison) => {
    return Math.max(current.sets.length, comparison.sets.length);
  };

  // Format comparison value with indicator
  const formatComparison = (current, previous) => {
    if (!current || !previous) return "";

    const currentVal = parseFloat(current);
    const previousVal = parseFloat(previous);

    if (currentVal > previousVal) {
      return `↑ ${previous}`;
    } else if (currentVal < previousVal) {
      return `↓ ${previous}`;
    } else {
      return `= ${previous}`;
    }
  };

  return (
    <div className="exercise-comparison mt-4">
      <h3>Compare with Another Day</h3>

      {!isComparing ? (
        <div className="comparison-controls">
          <input
            type="date"
            className="form-control"
            value={compareDate}
            onChange={handleDateChange}
          />
          <button
            className="btn btn-primary"
            onClick={fetchComparisonData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Compare"}
          </button>
        </div>
      ) : (
        <>
          <div className="comparison-header d-flex justify-content-between align-items-center mb-3">
            <h4 className="comparison-title">
              Comparing with:{" "}
              <span className="comparison-date">
                {new Date(compareDate).toLocaleDateString()}
              </span>
            </h4>
            <button className="btn btn-secondary" onClick={resetComparison}>
              Reset
            </button>
          </div>

          <div className="comparison-results">
            {getComparisonData().length > 0 ? (
              getComparisonData().map((item, index) => (
                <div key={index} className="comparison-item card mb-4">
                  <div className="card-header">
                    <h4 className="mb-0">{item.name}</h4>
                  </div>
                  <div className="card-body">
                    {/* Desktop view table (will be hidden on mobile) */}
                    <div className="desktop-table">
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Current Reps</th>
                            <th>Current Weight</th>
                            <th>Previous Reps</th>
                            <th>Previous Weight</th>
                            <th>Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({
                            length: getMaxSets(item.current, item.comparison),
                          }).map((_, setIndex) => {
                            const currentSet =
                              item.current.sets[setIndex] || {};
                            const comparisonSet =
                              item.comparison.sets[setIndex] || {};

                            // Calculate weight difference
                            let weightDiff = "";
                            if (currentSet.weight && comparisonSet.weight) {
                              const diff =
                                parseFloat(currentSet.weight) -
                                parseFloat(comparisonSet.weight);
                              if (diff !== 0) {
                                weightDiff = diff > 0 ? `+${diff}` : `${diff}`;
                              }
                            }

                            return (
                              <tr key={`desktop-${setIndex}`}>
                                <td>{setIndex + 1}</td>
                                <td>{currentSet.reps || "-"}</td>
                                <td>{currentSet.weight || "-"}</td>
                                <td
                                  className={
                                    comparisonSet.reps &&
                                    currentSet.reps &&
                                    parseInt(comparisonSet.reps) >
                                      parseInt(currentSet.reps)
                                      ? "text-danger"
                                      : comparisonSet.reps &&
                                        currentSet.reps &&
                                        parseInt(comparisonSet.reps) <
                                          parseInt(currentSet.reps)
                                      ? "text-success"
                                      : ""
                                  }
                                >
                                  {comparisonSet.reps || "-"}
                                </td>
                                <td
                                  className={
                                    comparisonSet.weight &&
                                    currentSet.weight &&
                                    parseFloat(comparisonSet.weight) >
                                      parseFloat(currentSet.weight)
                                      ? "text-danger"
                                      : comparisonSet.weight &&
                                        currentSet.weight &&
                                        parseFloat(comparisonSet.weight) <
                                          parseFloat(currentSet.weight)
                                      ? "text-success"
                                      : ""
                                  }
                                >
                                  {comparisonSet.weight || "-"}
                                </td>
                                <td
                                  className={
                                    weightDiff.startsWith("+")
                                      ? "text-success"
                                      : weightDiff.startsWith("-")
                                      ? "text-danger"
                                      : ""
                                  }
                                >
                                  {weightDiff || "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile view table (will be hidden on desktop) */}
                    <div className="mobile-table">
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Reps (vs prev)</th>
                            <th>Weight (vs prev)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({
                            length: getMaxSets(item.current, item.comparison),
                          }).map((_, setIndex) => {
                            const currentSet =
                              item.current.sets[setIndex] || {};
                            const comparisonSet =
                              item.comparison.sets[setIndex] || {};

                            const repsComparison = comparisonSet.reps
                              ? formatComparison(
                                  currentSet.reps,
                                  comparisonSet.reps
                                )
                              : "";

                            const weightComparison = comparisonSet.weight
                              ? formatComparison(
                                  currentSet.weight,
                                  comparisonSet.weight
                                )
                              : "";

                            return (
                              <tr key={`mobile-${setIndex}`}>
                                <td>{setIndex + 1}</td>
                                <td>
                                  {currentSet.reps || "-"}
                                  {repsComparison && (
                                    <span
                                      className={
                                        repsComparison.startsWith("↑")
                                          ? "comparison-up"
                                          : repsComparison.startsWith("↓")
                                          ? "comparison-down"
                                          : "comparison-equal"
                                      }
                                    >
                                      {" "}
                                      {repsComparison}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {currentSet.weight || "-"}
                                  {weightComparison && (
                                    <span
                                      className={
                                        weightComparison.startsWith("↑")
                                          ? "comparison-up"
                                          : weightComparison.startsWith("↓")
                                          ? "comparison-down"
                                          : "comparison-equal"
                                      }
                                    >
                                      {" "}
                                      {weightComparison}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Notes section */}
                    <div className="notes-container mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          {item.current.notes && (
                            <div className="notes-section">
                              <strong>Current Notes:</strong>{" "}
                              {item.current.notes}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          {item.comparison.notes && (
                            <div className="notes-section">
                              <strong>Previous Notes:</strong>{" "}
                              {item.comparison.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Performance summary */}
                    <div className="performance-summary">
                      <h5>Performance Summary:</h5>
                      {(() => {
                        // Calculate total volume for both workouts
                        const currentVolume = item.current.sets.reduce(
                          (total, set) => {
                            return (
                              total +
                              (parseFloat(set.weight) || 0) *
                                (parseInt(set.reps) || 0)
                            );
                          },
                          0
                        );

                        const comparisonVolume = item.comparison.sets.reduce(
                          (total, set) => {
                            return (
                              total +
                              (parseFloat(set.weight) || 0) *
                                (parseInt(set.reps) || 0)
                            );
                          },
                          0
                        );

                        const volumeDiff = currentVolume - comparisonVolume;
                        const percentChange = comparisonVolume
                          ? ((volumeDiff / comparisonVolume) * 100).toFixed(1)
                          : 0;

                        return (
                          <div
                            className={`alert ${
                              volumeDiff > 0
                                ? "alert-success"
                                : volumeDiff < 0
                                ? "alert-danger"
                                : "alert-secondary"
                            }`}
                          >
                            Total volume: {currentVolume.toFixed(1)} vs{" "}
                            {comparisonVolume.toFixed(1)}
                            {volumeDiff !== 0 && (
                              <span>
                                {" "}
                                ({volumeDiff > 0 ? "+" : ""}
                                {percentChange}% from previous workout)
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">
                No matching exercises found between these dates.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseComparison;
