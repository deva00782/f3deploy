import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import backgroundVideo from "../assets/background.mp4";
import { API_BASE_URL } from "../config";

function Login({ setRole }) {

  const navigate = useNavigate();

  const [role, setRoleState] = useState("consumer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ================= SIGN UP ================= */

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        {
          email,
          password,
          role,
        }
      );

      alert(response.data.message);

    } catch (error) {
      console.log("SIGNUP ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  /* ================= SIGN IN ================= */

  const handleSignin = async () => {
    try {

      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      /* SAVE DATA */

      localStorage.setItem("role", response.data.role);
      localStorage.setItem("farmerName", response.data.name);

      if (setRole) {
        setRole(response.data.role);
      }

      /* REDIRECT */

      if (response.data.role === "farmer") {

        navigate("/dashboard");

      } else {

        navigate("/marketplace");

      }

    } catch (error) {

      console.log("LOGIN ERROR:", error.response?.data);

      alert(
        error.response?.data?.message || "Login failed"
      );

    }
  };

  return (

    <div className="login-page">

      <video
        autoPlay
        loop
        muted
        className="video-bg"
      >
        <source
          src={backgroundVideo}
          type="video/mp4"
        />
      </video>

      <div className="login-card">

        <h1>Welcome Back</h1>

        <p>Select your role</p>

        <div className="role-buttons">

          <div
            className={`role-card ${
              role === "farmer"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setRoleState("farmer")
            }
          >
            <span className="emoji">
              👨‍🌾
            </span>

            <p>Farmer</p>

          </div>

          <div
            className={`role-card ${
              role === "consumer"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setRoleState("consumer")
            }
          >
            <span className="emoji">
              🛒
            </span>

            <p>Consumer</p>

          </div>

        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <div className="auth-buttons">

          <button onClick={handleSignin}>
            Sign In
          </button>

          <button onClick={handleSignup}>
            Sign Up
          </button>

        </div>

      </div>

    </div>

  );
}

export default Login;