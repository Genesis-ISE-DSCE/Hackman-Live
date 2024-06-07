import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(currentTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      setTimeLeft(calculateTimeLeft(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft(now) {
    if (now < startTime) {
      return startTime - now;
    } else if (now >= startTime && now <= endTime) {
      return endTime - now;
    } else {
      return 0;
    }
  }

  function formatTime(ms) {
    if (ms <= 0) return "Event has ended";
    let totalSeconds = Math.floor(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 3600 % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className='font-outfit text-lg'>
      <span className='inline'>{currentTime < startTime ? "Starts in " : ""}</span>
      <span className='bg-indigo-100 shadow-sm shadow-slate-950 w-28 inline-block text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300'>{formatTime(timeLeft)}</span>
    </div>
  );
};

// Example usage:
// The following epoch times correspond to specific future dates.
// You can adjust them to appropriate values for your tests.


export default CountdownTimer;
