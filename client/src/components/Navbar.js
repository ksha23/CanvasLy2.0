import React from "react";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RESET } from "../redux/constant";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
    };
    fetchData();
  }, []);

  async function auth() {
    window.open("http://localhost:4000/api/v1/auth/google", "_self");
  }

  async function logout() {
    const response = await fetch("http://localhost:4000/api/v1/auth/logout", {
      method: "get",
      credentials: "include",
    });

    const data = await response.json();
    if (data.message === "Successfully logged out") {
      setIsLoggedIn(false);
      setUserData(null);
      dispatch({ type: RESET });
      navigate("/");
    }
  }

  async function fetchUserData() {
    const response = await fetch(
      "http://localhost:4000/api/v1/users/userSimple",
      {
        method: "get",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (data.user === null) {
      setIsLoggedIn(false);
      setUserData(null);
    } else {
      setIsLoggedIn(true);
      setUserData(data.user);
    }
  }

  return (
    <header className="navbar">
      <div className="left-section">
        <img
          className="logo"
          src={process.env.PUBLIC_URL + "/canvasly.png"}
          alt="Canvasly Logo"
        />
        <Link to="/" className="nav-link">
          <strong>Home</strong>
        </Link>
        <Link to="/assignments" className="nav-link">
          <strong>Assignments</strong>
        </Link>
        <Link to="/settings" className="nav-link">
          <strong>Settings</strong>
        </Link>
      </div>
      <div className={isLoggedIn ? "right-section" : "right-section-login"}>
        <div className="user-profile">
          {userData && (
            <img className="profile-img" src={userData.photo} alt="Profile" />
          )}
          {userData && <h2 className="profile-name">{userData.googleName}</h2>}
        </div>
        <div className="buttons">
          {!isLoggedIn && (
            <button className="login-btn" onClick={() => auth()}>
              <img
                className="google-image"
                src={process.env.PUBLIC_URL + "/sign-in2.png"}
                alt="Sign In"
              />
            </button>
          )}
          {isLoggedIn && (
            <button className="logout-btn" onClick={() => logout()}>
              <strong>Log Out</strong>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
