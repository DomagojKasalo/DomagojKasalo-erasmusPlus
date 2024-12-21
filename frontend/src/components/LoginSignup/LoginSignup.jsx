import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginSignup.css';  // Make sure you have your styles for login and signup
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import surname_icon from '../Assets/surname.png';

const LoginSignup = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
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
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Spremanje korisničkih podataka
        setSuccess(data.message);
        setError(null);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
        });
        setAction("Login");
        onLogin(); // Pozivanje onLogin nakon uspješne registracije
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
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Spremanje korisničkih podataka
        setSuccess("Logged in successfully!");
        setError(null);
        onLogin(); // Pozivanje onLogin nakon uspješne prijave
        navigate("/home");  // Redirect to Home after successful login
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
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={surname_icon} alt="" />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
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
            name="password"
            value={formData.password}
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

      <div className="submit-cointainer">
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
  );
};

export default LoginSignup;
