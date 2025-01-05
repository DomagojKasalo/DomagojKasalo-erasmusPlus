import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import surname_icon from '../Assets/surname.png';
import address_icon from '../Assets/address.png';
import oib_icon from '../Assets/person.png';
import phone_icon from '../Assets/phone.png';
import university_icon from '../Assets/university.png';

const LoginSignup = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    lozinka: "",
    role: "",
    gender: "",
    adresa: "",
    oib: "",
    telefon: "",
    sveuciliste: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  // Logika za odjavu pri učitavanju aplikacije
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAction("Login"); // Resetiraj stanje na "Login"
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async () => {
  
    let validationErrors=[];

    if (!formData.ime) {
      validationErrors.push("Ime je obavezno.");
    }
    if (!formData.prezime) {
      validationErrors.push("Prezime je obavezno.");
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push("Unesite ispravan email.");
    }
    if (formData.lozinka.length < 6) {
      validationErrors.push("Lozinka mora imati najmanje 6 znakova.");
    }
    if (!['M', 'Ž'].includes(formData.gender)) {
      validationErrors.push('Spol mora biti "M" ili "Ž".');
    }
    if (!['admin', 'student', 'nastavnik'].includes(formData.role)) {
      validationErrors.push('Odabir uloge je potreban".');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ime: formData.ime,
          prezime: formData.prezime,
          email: formData.email,
          lozinka: formData.lozinka,
          spol: formData.gender,
          uloga: formData.role,
          adresa: formData.adresa,
          oib: formData.oib,
          telefon: formData.telefon,
          sveuciliste: formData.sveuciliste,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Registracija je uspješna!");
        setError(null);
      } else {
        setError(data.message || "Došlo je do pogreške");
      }
    } catch (error) {
      setError("Nešto je krivo!");
    }
  };

  const handleLogin = async () => {
    let validationErrors=[];


    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push("Unesite ispravan email.");
    }
    if (formData.lozinka.length < 6) {
      validationErrors.push("Lozinka mora imati najmanje 6 znakova.");
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
    
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

      const data = await response.json();
      if (response.ok) {
        const user = {
          ime: data.korisnik.ime,
          prezime: data.korisnik.prezime,
          email: data.korisnik.email,
          role: data.korisnik.uloga,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log('User data saved to localStorage:', user);
        setSuccess("Prijava je uspješna!");
        setError(null);
        onLogin();
        navigate("/profile");
      } else {
        setError(data.message || "Došlo je do pogreške");
      }
    } catch (error) {
      setError("Nešto je krivo!");
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
                name="ime"
                value={formData.ime}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={surname_icon} alt="" />
              <input
                type="text"
                placeholder="Prezime"
                name="prezime"
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
            <div className="input">
              <img src={address_icon} alt="" />
              <input
                type="text"
                placeholder="Adresa"
                name="adresa"
                value={formData.adresa}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={oib_icon} alt="" />
              <input
                type="text"
                placeholder="OIB"
                name="oib"
                value={formData.oib}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={phone_icon} alt="" />
              <input
                type="text"
                placeholder="Telefon"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
              />
            </div>
            <div className="input">
              <img src={university_icon} alt="" />
              <input
                type="text"
                placeholder="Sveučilište"
                name="sveuciliste"
                value={formData.sveuciliste}
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
            <option value="" disabled>Odaberi ulogu</option>
            <option value="nastavnik">Nastavnik</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="submit-container">
        <div className="submit-inline">
          {action === "Login" && (
            <>
              <div className="submit" onClick={() => setAction("Sign Up")}>Registracija</div>
              <div className="submit" onClick={handleLogin}>Prijava</div>
            </>
          )}
          {action === "Sign Up" && (
            <>
              <div className="submit" onClick={handleRegister}>Registracija</div>
              <div className="submit gray" onClick={() => setAction("Login")}>Povratak na login</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
