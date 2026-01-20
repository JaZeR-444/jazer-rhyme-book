/**
 * ActivityCalendar.jsx
 * GitHub-style activity heatmap calendar
 */

import React, { useMemo } from 'react';
import './ActivityCalendar.css';

export default function ActivityCalendar({ activityData, daysToShow = 365 }) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const weeks = [];
    let currentWeek = [];

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = activityData[dateStr] || 0;

      currentWeek.push({
        date: dateStr,
        count,
        level: getActivityLevel(count),
        dayOfWeek: date.getDay(),
      });

      if (currentWeek.length === 7 || i === 0) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    return weeks;
  }, [activityData, daysToShow]);

  const getActivityLevel = (count) => {
    if (count === 0) return 0;
    if (count < 5) return 1;
    if (count < 10) return 2;
    if (count < 20) return 3;
    return 4;
  };

  const getTooltipText = (day) => {
    const date = new Date(day.date);
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${formatted}: ${day.count} ${day.count === 1 ? 'activity' : 'activities'}`;
  };

  const maxCount = Math.max(...Object.values(activityData));

  return (
    <div className="activity-calendar">
      <div className="activity-calendar__header">
        <h3 className="activity-calendar__title">Activity Over Last {daysToShow} Days</h3>
        <div className="activity-calendar__legend">
          <span className="activity-calendar__legend-label">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`activity-calendar__legend-box activity-calendar__legend-box--level-${level}`}
            />
          ))}
          <span className="activity-calendar__legend-label">More</span>
        </div>
      </div>

      <div className="activity-calendar__grid">
        <div className="activity-calendar__weeks">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="activity-calendar__week">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`activity-calendar__day activity-calendar__day--level-${day.level}`}
                  title={getTooltipText(day)}
                  data-date={day.date}
                  data-count={day.count}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="activity-calendar__summary">
        <p className="activity-calendar__summary-text">
          <strong>{Object.values(activityData).reduce((sum, val) => sum + val, 0)}</strong> total
          activities in the last {daysToShow} days
        </p>
        <p className="activity-calendar__summary-text">
          Peak day: <strong>{maxCount}</strong> activities
        </p>
      </div>
    </div>
  );
}
