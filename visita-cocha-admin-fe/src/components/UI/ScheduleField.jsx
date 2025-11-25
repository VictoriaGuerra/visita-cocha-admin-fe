import React, { useState } from 'react';
import './ScheduleField.css';

const DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

const ScheduleField = ({ value = [], onChange }) => {
  const [schedule, setSchedule] = useState(
    value.length > 0
      ? value
      : DAYS.map(day => ({ day, open: false, hours: { start: '', end: '' } }))
  );

  const handleDayToggle = (dayIndex) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].open = !newSchedule[dayIndex].open;
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  const handleHoursChange = (dayIndex, field, time) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].hours[field] = time;
    setSchedule(newSchedule);
    onChange(newSchedule);
  };

  return (
    <div className="schedule-field">
      {schedule.map((daySchedule, index) => (
        <div key={daySchedule.day} className="day-schedule">
          <div className="day-toggle">
            <input
              type="checkbox"
              checked={daySchedule.open}
              onChange={() => handleDayToggle(index)}
              id={`day-${index}`}
            />
            <label htmlFor={`day-${index}`}>{daySchedule.day}</label>
          </div>
          {daySchedule.open && (
            <div className="hours-input">
              <input
                type="time"
                value={daySchedule.hours.start}
                onChange={(e) => handleHoursChange(index, 'start', e.target.value)}
              />
              <span>a</span>
              <input
                type="time"
                value={daySchedule.hours.end}
                onChange={(e) => handleHoursChange(index, 'end', e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleField;