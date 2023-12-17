import React from "react";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ensure you import useHistory from react-router-dom

async function auth() {
  window.location.href = "http://localhost:4000/api/v1/auth/google";
}

async function logout() {
  const response = await fetch("http://localhost:4000/api/v1/auth/logout", {
    method: "get",
    credentials: "include",
  });

  const data = await response.json();
  if (data.message === "Successfully logged out") {
    window.location.reload();
  }
}

async function getUserData() {
  const response = await fetch("http://localhost:4000/api/v1/auth/user", {
    method: "get",
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

const Navbar = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await getUserData();
      if (response.message === "Unauthorized" || response.user === null) {
        setName("");
        setIsLogged(false);
        navigate("/");
      } else {
        setName(response.user.googleName);
        setImage(response.user.photo);
        setIsLogged(true);
        navigate("/assignments");
      }
    }
    fetchData();
  }, [navigate]);

  return (
    <header className="navbar">
      <div className="left-section">
        <img
          className="logo"
          src={process.env.PUBLIC_URL + "/canvasly.png"}
          alt="Canvasly Logo"
        />
      </div>
      <div className="right-section">
        <div className="user-profile">
          {image && <img className="profile-img" src={image} alt="Profile" />}
          <h2 className="profile-name">{name}</h2>
        </div>
        <div className="buttons">
          {!isLogged && (
            <button className="login-btn" onClick={() => auth()}>
              <img
                className="google-image"
                src={process.env.PUBLIC_URL + "/sign-in2.png"}
                alt="Sign In"
              />
            </button>
          )}

          {isLogged && (
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
