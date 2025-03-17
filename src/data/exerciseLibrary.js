// src/data/exerciseLibrary.js
export const exerciseLibrary = [
  {
    id: 1,
    name: "Barbell Bench Press",
    gifUrl: "https://example.com/bench-press.gif",
    bodyPart: "chest",
  },
  {
    id: 2,
    name: "Squat",
    gifUrl: "https://example.com/squat.gif",
    bodyPart: "legs",
  },
  {
    id: 3,
    name: "Deadlift",
    gifUrl:
      "https://i.pinimg.com/originals/fd/54/03/fd54030652211ed341805115089acbe6.gif",
    bodyPart: "back",
  },
  {
    id: 4,
    name: "Pull-up",
    gifUrl: "https://example.com/pullup.gif",
    bodyPart: "back",
  },
  {
    id: 5,
    name: "Push-up",
    gifUrl: "https://example.com/pushup.gif",
    bodyPart: "chest",
  },
  {
    id: 6,
    name: "Cable Narrow Underhand Pulldown",
    gifUrl: "https://media1.tenor.com/m/QIGsQJrEOV0AAAAC/pulldown-weights.gif",
    bodyPart: "Lower Lats",
  },
  {
    id: 7,
    name: "Cable Widegrip Pulldown",
    gifUrl: "https://media1.tenor.com/m/AR6A1jMcnE8AAAAC/lat-pull-down.gif",
    bodyPart: "Upper Lats",
  },
  {
    id: 8,
    name: "Cable Mediumgrip Pulldown",
    gifUrl:
      "https://musclemagfitness.com/wp-content/uploads/neutral-grip-lat-pulldown-exercise.gif",
    bodyPart: "Lats",
  },
  {
    id: 9,
    name: "Cable Narrow Pulldown",
    gifUrl:
      "https://musclemagfitness.com/wp-content/uploads/close-grip-lat-pulldown-exercise.gif",
    bodyPart: "Lower Lats",
  },
  {
    id: 10,
    name: "Seated Cable Row",
    gifUrl:
      "https://musclemagfitness.com/wp-content/uploads/seated-cable-row-exercise.gif",
    bodyPart: "Upper Back",
  },
  {
    id: 11,
    name: "Seated V-bar Cable Row",
    gifUrl:
      "https://musclemagfitness.com/wp-content/uploads/seated-v-bar-cable-row-exercise.gif",
    bodyPart: "Upper Back",
  },
  {
    id: 12,
    name: "Dumbell One Arm Row",
    gifUrl:
      "https://hips.hearstapps.com/hmg-prod/images/workouts/2017/10/singlearmrow-1509461862.gif?resize=640:*",
    bodyPart: "Upper Back",
  },
  {
    id: 13,
    name: "Dumbell Pullover",
    gifUrl:
      "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Dumbbell-Pullover.gif?resize=600%2C600&ssl=1",
    bodyPart: "Back and Chest",
  },
  {
    id: 14,
    name: "Dumbell Bicep Curl",
    gifUrl: "https://media1.tenor.com/m/6uinYQq-1TYAAAAd/biceps-curl.gif",
    bodyPart: "Bicep",
  },
  {
    id: 15,
    name: "Dumbell Hammer Curl",
    gifUrl:
      "https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/hammercurl-1456956209.gif",
    bodyPart: "Bicep",
  },
  {
    id: 16,
    name: "Dumbell Concentration Curl",
    gifUrl:
      "https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Concentration-curl.gif?fit=600%2C600&ssl=1",
    bodyPart: "Bicep",
  },
];

export const searchExercises = (query) => {
  if (!query) return [];

  const lowercasedQuery = query.toLowerCase();
  return exerciseLibrary.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(lowercasedQuery) ||
      exercise.bodyPart.toLowerCase().includes(lowercasedQuery)
  );
};
