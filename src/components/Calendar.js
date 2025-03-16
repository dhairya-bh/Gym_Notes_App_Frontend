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
import isSameDay from "date-fns/isSameDay"; // Add this import
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

const CustomEvent = ({ event }) => {
  const { width } = useWindowSize();

  // Determine if the event has 0 exercises
  const hasZeroExercises = event.title === "0";

  return (
    <div
      style={{
        backgroundColor: hasZeroExercises ? "#cccccc" : "#1890ff", // Gray for 0, blue otherwise
        color: hasZeroExercises ? "#555555" : "#ffffff", // Darker text for gray, white for blue
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

const GymCalendar = ({ onDateSelect }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { width, height } = useWindowSize();

  const fetchWorkouts = async (date) => {
    try {
      setLoading(true);
      const exercises = await getExercises();
      const exercisesByDate = {};

      exercises.forEach((exercise) => {
        const dateKey = exercise.date.split("T")[0];
        if (!exercisesByDate[dateKey]) {
          exercisesByDate[dateKey] = [];
        }
        exercisesByDate[dateKey].push(exercise);
      });

      // Generate all dates in the specified month
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const allDatesInMonth = [];
      for (let d = startOfMonth; d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        allDatesInMonth.push(new Date(d));
      }

      const calendarEvents = allDatesInMonth.map((date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        const exercises = exercisesByDate[dateKey] || [];
        const eventDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          12,
          0,
          0
        );

        return {
          title: `${exercises.length}`,
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

  useEffect(() => {
    fetchWorkouts(currentDate); // Fetch exercises for the initial month
  }, []);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
    fetchWorkouts(newDate); // Fetch exercises for the new month
  };

  useEffect(() => {
    const handleTouchStart = (event) => {
      const target = event.target;
      if (
        target.classList.contains("rbc-day-bg") ||
        target.classList.contains("rbc-date-cell")
      ) {
        target.click();
      }
    };

    const calendarElement = document.querySelector(".rbc-calendar");
    if (calendarElement) {
      calendarElement.addEventListener("touchstart", handleTouchStart);
    }

    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener("touchstart", handleTouchStart);
      }
    };
  }, [currentDate]);

  const handleSelectEvent = (event) => {
    onDateSelect(event.start);
  };

  const handleSelectSlot = (slotInfo) => {
    onDateSelect(slotInfo.start);
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

  const calendarHeight = width <= 768 ? height - 100 : 600;

  return (
    <div
      style={{
        height: calendarHeight,
        margin: width <= 768 ? "0" : "20px",
        padding: width <= 768 ? "0" : "0 20px",
      }}
    >
      <Calendar
        key={currentDate.toISOString()} // Force remount on date change
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
