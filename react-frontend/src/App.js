import React, { useState, useEffect } from "react";
import "./App.css";
import boardImage from "./board.png"; // Make sure board.png is inside src folder

function App() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("80");
  const [participation, setParticipation] = useState("6");
  const [studyHours, setStudyHours] = useState("10");
  const [sleepHours, setSleepHours] = useState("7");
  const [prediction, setPrediction] = useState(null);
  const [quote, setQuote] = useState("");

  const passQuotes = [
    "Success is no accident.",
    "You did the work, now enjoy the result!",
    "Great job, future star!"
  ];
  const failQuotes = [
    "Failure is the stepping stone to success.",
    "Try harder next time!",
    "Every mistake is a lesson."
  ];

  useEffect(() => {
    const quotes = prediction === "Pass" ? passQuotes : failQuotes;

    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [prediction, passQuotes, failQuotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "Attendance (%)": Number(attendance),
          "Participation_Score": Number(participation),
          "Study_Hours_per_Week": Number(studyHours),
          "Sleep_Hours_per_Night": Number(sleepHours)
        })
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (err) {
      console.error("Error:", err);
      setPrediction("Error: Could not connect to API.");
    }
  };

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${boardImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex"
      }}
    >
      {/* Input Section (left side) */}
      <div className="input-section">
        <h2>Student Predictor</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Attendance (%)</label>
          <select value={attendance} onChange={(e) => setAttendance(e.target.value)}>
            <option value="60">60</option>
            <option value="75">75</option>
            <option value="80">80</option>
            <option value="90">90</option>
            <option value="100">100</option>
          </select>

          <label>Participation Score</label>
          <select value={participation} onChange={(e) => setParticipation(e.target.value)}>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>

          <label>Study Hours per Week</label>
          <select value={studyHours} onChange={(e) => setStudyHours(e.target.value)}>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>

          <label>Sleep Hours per Night</label>
          <select value={sleepHours} onChange={(e) => setSleepHours(e.target.value)}>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>

          <button type="submit">Predict</button>
        </form>
      </div>

      {/* Output Section (right side) */}
      <div className="result-section">
        {prediction && (
          <>
            <h2>{name}, You will {prediction}</h2>
            <p className="quote">{quote}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
