import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import isBefore from "date-fns/isBefore";
import isToday from "date-fns/isToday";
import startOfDay from "date-fns/startOfDay";
import isSameMonth from "date-fns/isSameMonth";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getExercises } from "../utils/api";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom hook to track window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

// Custom Event Component
const CustomEvent = ({ event }) => {
  const { width } = useWindowSize();

  return (
    <div
      style={{
        backgroundColor: "#1890ff",
        color: "#ffffff",
        padding: "2px 6px",
        borderRadius: "4px",
        display: "inline-block",
        fontSize: width <= 768 ? "10px" : "12px",
        whiteSpace: "nowrap",
        margin: "2px",
      }}
    >
      {event.title}
    </div>
  );
};

// Custom Toolbar Component
const CustomToolbar = (toolbar) => {
  const { width } = useWindowSize();

  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  const label = () => {
    const date = toolbar.date;
    return <span>{format(date, "MMMM yyyy")}</span>;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: width <= 768 ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: width <= 768 ? "10px" : "20px",
        padding: width <= 768 ? "0 10px" : "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: width <= 768 ? "column" : "row",
        }}
      >
        <button
          onClick={goToBack}
          style={{ margin: "0 5px", padding: "8px 12px", cursor: "pointer" }}
        >
          &lt; Previous
        </button>
        <button
          onClick={goToCurrent}
          style={{ margin: "0 5px", padding: "8px 12px", cursor: "pointer" }}
        >
          Today
        </button>
        <button
          onClick={goToNext}
          style={{ margin: "0 5px", padding: "8px 12px", cursor: "pointer" }}
        >
          Next &gt;
        </button>
      </div>
      <span
        style={{
          fontWeight: "bold",
          fontSize: width <= 768 ? "16px" : "20px",
          flex: 1,
          textAlign: "center",
        }}
      >
        {label()}
      </span>
    </div>
  );
};

// Main Calendar Component
const GymCalendar = ({ onDateSelect }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const exercises = await getExercises();

        // Group exercises by date using UTC date
        const exercisesByDate = {};

        exercises.forEach((exercise) => {
          // Extract the date part from ISO string (YYYY-MM-DD)
          const dateKey = exercise.date.split("T")[0];

          if (!exercisesByDate[dateKey]) {
            exercisesByDate[dateKey] = [];
          }
          exercisesByDate[dateKey].push(exercise);
        });

        // Create events for the calendar with correct dates
        const calendarEvents = Object.keys(exercisesByDate).map((dateKey) => {
          const exercises = exercisesByDate[dateKey];
          const [year, month, monthDay] = dateKey.split("-").map(Number);

          // Create dates at noon to avoid timezone issues
          const eventDate = new Date(year, month - 1, monthDay, 12, 0, 0);

          return {
            title: `${exercises.length}${exercises.length > 1 ? "s" : ""}`,
            start: eventDate,
            end: eventDate,
            allDay: true,
            resource: exercises,
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching workouts for calendar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleSelectEvent = (event) => {
    onDateSelect(event.start);
  };

  const handleSelectSlot = (slotInfo) => {
    onDateSelect(slotInfo.start);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    const isPastDate = isBefore(startOfDay(date), startOfDay(today));
    const isCurrentMonth = isSameMonth(date, currentDate);

    let className = "";
    let style = {};

    if (!isCurrentMonth) {
      className = "rbc-off-range-date";
      style = {
        backgroundColor: "#ffffff",
      };
    } else if (isPastDate) {
      style = {
        backgroundColor: "#f5f5f5",
        color: "#aaaaaa",
      };
    }

    if (isToday(date)) {
      style = {
        ...style,
        backgroundColor: "#e6f7ff",
        fontWeight: "bold",
        color: "#1890ff",
      };
    }

    return {
      className,
      style,
    };
  };

  const customComponents = {
    toolbar: CustomToolbar,
    event: CustomEvent,
  };

  const formats = {
    dateFormat: (date) => format(date, "d"),
    dayFormat: (date) => format(date, "EEE"),
    monthHeaderFormat: (date) => format(date, "MMMM yyyy"),
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  const calendarHeight = width <= 768 ? height - 100 : 600; // Use full height on mobile

  return (
    <div
      style={{
        height: calendarHeight,
        margin: width <= 768 ? "0" : "20px",
        padding: width <= 768 ? "0" : "0 20px",
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        dayPropGetter={dayPropGetter}
        onNavigate={handleNavigate}
        date={currentDate}
        formats={formats}
        components={customComponents}
        views={["month"]}
        defaultView="month"
      />
    </div>
  );
};

export default GymCalendar;
