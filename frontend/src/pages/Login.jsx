import React, { useState } from "react";
import { saveToken } from "../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const { token, isAdmin } = response.data;

      saveToken(token);
      localStorage.setItem("isAdmin", isAdmin);

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F9F9F9",
      padding: "1rem",
    },
    form: {
      backgroundColor: "#FFFFFF",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "100%",
      border: "1px solid #E0E0E0",
    },
    heading: {
      fontSize: "1.75rem",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: "1.5rem",
      color: "#2C3E50",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#2C3E50",
      marginBottom: "0.25rem",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "0.5rem 0.75rem",
      marginBottom: "1.25rem",
      border: "1px solid #CCC",
      borderRadius: "0.5rem",
      outline: "none",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      backgroundColor: "#2C3E50",
      color: "#FFFFFF",
      padding: "0.75rem",
      border: "none",
      borderRadius: "0.5rem",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    buttonHover: {
      backgroundColor: "#1A252F",
    },
    errorBox: {
      backgroundColor: "#FEE2E2",
      color: "#B91C1C",
      padding: "0.5rem 0.75rem",
      borderRadius: "0.375rem",
      marginBottom: "1rem",
      fontSize: "0.875rem",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Welcome Back</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
