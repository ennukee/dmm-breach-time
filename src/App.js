import React, { useState, useEffect } from 'react';
import './App.css';

const baseDate = new Date("2024-07-19T00:00:00.000Z");

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

const allBreachTimes = Array.from({ length: 14 }, (_, index) => index).flatMap(day => {
  const base = addDays(baseDate, day);
  return [
    addHours(base, 2),
    addHours(base, 10),
    addHours(base, 19),
  ];
}).slice(2, 43);

function App() {
  const filteredBreachTimes = allBreachTimes.filter(time => time >= new Date()).slice(0, 3);
  const [countdowns, setCountdowns] = useState([]);

  useEffect(() => {
    const updateCountdowns = () => {
      const countdowns = filteredBreachTimes.map((time, index) => {
        const label = `Breach #${index + 1}`;
        const remainingTime = getTimeRemaining(time);
        return { time, label, remainingTime };
      }) 

      setCountdowns(countdowns);
    };

    const getTimeRemaining = (endTime) => {
      const total = Date.parse(endTime) - Date.parse(new Date());
      const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
      const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0);
      const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
      const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);
    
      return { days, hours, minutes, seconds };
    };

    updateCountdowns();

    const interval = setInterval(updateCountdowns, 1000); // Update every second

    return () => clearInterval(interval);
  }, [filteredBreachTimes]);

  return (
    <div className="container">
      <div className="text">the next breach is in...</div>
      {countdowns.length === 3 && (
        <div className="time-text-primary">
          {countdowns[0].remainingTime.hours}h {countdowns[0].remainingTime.minutes}m {countdowns[0].remainingTime.seconds}s
        </div>
      )}
      <div className="subtext">other upcoming breaches...</div>
      {countdowns.slice(1).map((countdown, index) => (
        <div key={index} className="time-text">
          {countdown.remainingTime.days}d {countdown.remainingTime.hours}h {countdown.remainingTime.minutes}m {countdown.remainingTime.seconds}s
        </div>
      ))}
    </div>
  );
}

export default App;
