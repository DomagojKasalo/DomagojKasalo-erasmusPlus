import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import surname_icon from '../Assets/surname.png';

const LoginSignup = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    lozinka: "",
    role: "",
    gender: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ime: formData.ime, // Promijenjeno na 'ime' umjesto 'firstName'
          prezime: formData.prezime, // Promijenjeno na 'prezime' umjesto 'lastName'
          email: formData.email,
          lozinka: formData.lozinka,
          spol: formData.gender,
          uloga: formData.role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Registration successful!");
        setError(null);
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          lozinka: formData.lozinka,
        }),
      });

      let data = await response.text();
      try {
        data = JSON.parse(data);
      } catch (error) {
        data = { message: "Invalid JSON response" };
      }

      if (response.ok) {
        const user = {
          ime: data.korisnik.ime, // 'ime' sa backend-a
          prezime: data.korisnik.prezime, // 'prezime' sa backend-a
          email: data.korisnik.email,
          profileImage: data.korisnik.profileImage || "profile-placeholder.png",
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log('User data saved to localStorage:', user);
        setSuccess("Logged in successfully!");
        setError(null);
        onLogin();
        navigate("/profile");
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action === "Login" ? "Login" : "Sign Up"}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Sign Up" && (
          <>
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Ime"
                name="ime" // Promijenjeno na 'ime' umjesto 'firstName'
                value={formData.ime}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={surname_icon} alt="" />
              <input
                type="text"
                placeholder="Prezime"
                name="prezime" // Promijenjeno na 'prezime' umjesto 'lastName'
                value={formData.prezime}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Gender (M/Ž)"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            name="lozinka"
            value={formData.lozinka}
            onChange={handleInputChange}
          />
        </div>
        {action === "Sign Up" && (
          <select
            className="role-dropdown"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            <option value="" disabled>Choose Role</option>
            <option value="nastavnik">Nastavnik</option>
            <option value="student">Student</option>
          </select>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="submit-container">
        <div className="submit-inline">
          {action === "Login" && (
            <>
              <div className="submit" onClick={() => setAction("Sign Up")}>Sign Up</div>
              <div className="submit" onClick={handleLogin}>Login</div>
            </>
          )}
          {action === "Sign Up" && (
            <>
              <div className="submit" onClick={handleRegister}>Sign Up</div>
              <div className="submit gray" onClick={() => setAction("Login")}>Back to Login</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
