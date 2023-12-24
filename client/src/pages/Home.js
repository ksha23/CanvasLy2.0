import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import Youtube from "../components/Youtube";

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <div className="main-content">
        <h1>Welcome to CanvasLy</h1>
        <p>Empowering Students to Master Their Academic Journey</p>

        <div className="why-canvasly">
          <h2 className="subtitle">Why Choose CanvasLy?</h2>
          <ul className="selling-points">
            <li>
              Effortlessly manage upcoming assignments, quizzes, projects, and
              exams
            </li>
            <li>
              Personalize prioritization of assignments based on due date,
              difficulty, and type
            </li>
            <li>Never miss another assignment again!</li>
          </ul>
        </div>

        <div className="how-it-works">
          <h2 className="subtitle">How to Get Started:</h2>
          <ol className="steps">
            <li>Access "Canvas Calendar" in the Canvas side menu</li>
            <li>Locate "Calendar Feed" and copy the URL</li>
            <li>
              Open Google Calendar and select "+ Other Calendars" then "From
              URL"
            </li>
            <li>Paste the URL and click "Add Calendar"</li>
            <li>Sign in to CanvasLy using your Google account</li>
            <li>Choose the imported Canvas calendar to display assignments</li>
            <li>You're all set!</li>
          </ol>
          <br></br>

          <Youtube videoId="5tayaNGT-F4" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
