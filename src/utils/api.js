import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";

// Exercise API calls
export const getExercises = async () => {
  try {
    const response = await axios.get(`${API_URL}/exercises`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
};

export const getExercisesByDate = async (date) => {
  try {
    // Ensure we're using local date format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.get(
      `${API_URL}/exercises/date/${formattedDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises by date:", error);
    throw error;
  }
};

export const createExercise = async (exerciseData) => {
  try {
    // If date is a Date object, ensure we're using ISO format
    if (exerciseData.date instanceof Date) {
      // Create a date at noon to avoid timezone issues
      const year = exerciseData.date.getFullYear();
      const month = exerciseData.date.getMonth();
      const day = exerciseData.date.getDate();
      const normalizedDate = new Date(year, month, day, 12, 0, 0);
      exerciseData.date = normalizedDate.toISOString();
    }

    const response = await axios.post(`${API_URL}/exercises`, exerciseData);
    return response.data;
  } catch (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }
};

export const updateExercise = async (id, exerciseData) => {
  try {
    const response = await axios.put(
      `${API_URL}/exercises/${id}`,
      exerciseData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating exercise:", error);
    throw error;
  }
};

export const deleteExercise = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/exercises/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting exercise:", error);
    throw error;
  }
};

// Workout API calls
export const getWorkoutByDate = async (date) => {
  try {
    // Ensure we're using local date format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.get(
      `${API_URL}/workouts/date/${formattedDate}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No workout for this date is OK
    }
    console.error("Error fetching workout:", error);
    throw error;
  }
};

export const updateWorkoutNotes = async (date, notes) => {
  try {
    // Ensure we're using local date format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const response = await axios.post(
      `${API_URL}/workouts/date/${formattedDate}`,
      { notes }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating workout notes:", error);
    throw error;
  }
};
