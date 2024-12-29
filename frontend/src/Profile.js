import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Fetched user from localStorage:", fetchedUser);

    if (fetchedUser) {
      setFirstName(fetchedUser.ime || "");
      setLastName(fetchedUser.prezime || "");
      setEmail(fetchedUser.email || "");
      if (fetchedUser.profileImage) {
        setProfileImage(fetchedUser.profileImage);
      }
      setUser(fetchedUser);
    } else {
      console.error("No user data found in localStorage");
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !email) {
      alert("Sva polja moraju biti popunjena.");
      return;
    }

    if (!user || !user.id) {
      alert("Korisnik nije pronađen. Molimo, prijavite se ponovno.");
      return;
    }

    const updatedUser = {
      ime: firstName,
      prezime: lastName,
      email,
      profileImage,
    };

    try {
      console.log("Šaljem podatke na server:", updatedUser);
      const response = await fetch(`http://localhost:5000/api/users/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.korisnik));
        console.log("Podaci su uspješno spremljeni u localStorage:", data.korisnik);
        setIsEditing(false);
      } else {
        console.error("Greška pri spremanju korisnika:", data.message);
        alert(`Greška: ${data.message}`);
      }
    } catch (error) {
      console.error("Greška pri komunikaciji s poslužiteljem:", error);
      alert("Došlo je do pogreške. Pokušajte ponovno kasnije.");
    }
  };

  return (
    <div className="profile-section">
      <div className="display-section">
        <img src={profileImage || "profile-placeholder.png"} alt="Profile" width="100" />
        <div className="profile-details">
          <div>
            <label>Ime:</label>
            <span>{firstName}</span>
          </div>
          <div>
            <label>Prezime:</label>
            <span>{lastName}</span>
          </div>
          <div>
            <label>Email:</label>
            <span>{email}</span>
          </div>
          <div className="edit-button-container">
            <button onClick={handleEdit}>Uredi</button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-section-vertical">
          <form className="edit-form" onSubmit={handleSave}>
            <div>
              <label htmlFor="first-name-form">Ime:</label>
              <input
                type="text"
                id="first-name-form"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="last-name-form">Prezime:</label>
              <input
                type="text"
                id="last-name-form"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-form">E-mail:</label>
              <input
                type="email"
                id="email-form"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="profile-image-form">Slika profila:</label>
              <input
                type="file"
                id="profile-image-form"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <button type="submit">Spremi promjene</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
