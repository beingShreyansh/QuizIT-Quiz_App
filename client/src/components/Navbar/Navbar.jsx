// Navbar.jsx

import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const role = localStorage.getItem("role") === "admin" ? true : false;
    const id = localStorage.getItem("userId");
    setIsAdmin(role);
    setUserId(id);

    if (!role && id) {
      const userDetailsApiUrl = `${
        import.meta.env.VITE_API_URL
      }/user/getUserDetails/${id}`;
      axios
        .get(userDetailsApiUrl)
        .then((response) => {
          console.log(response.data);
          setUserName(response.data.name);
          setProfilePicture(response.data.profile_img_url);
        })
        .catch((error) => console.error("Error fetching user details:", error));
    }
  }, [userId]);

  return (
    <>
      <nav id="admin-navbar" className={`${menuOpen ? "open" : ""}`}>
        <div className="nav-wrapper">
          <div className="logo">
            <img width="150px" height="auto" src={Logo} alt="Logo" />
          </div>

          {isAdmin ? (
            <div id="navLinks" className={`${menuOpen ? "open" : ""}`}>
              <NavLink to="/admin/add-quiz" className="navlink">
                Add Quiz
              </NavLink>
              <NavLink to="/admin/user-history" className="navlink">
                User Statistics
              </NavLink>
              <NavLink to="/login" className="navlink">
                <button className="btn" onClick={handleLogout}>
                  Logout  
                </button>
              </NavLink>
            </div>
          ) : (
            <div
              id="navLinks"
              className={`${menuOpen ? "open" : ""}`}
              onClick={() => setDropdownOpen(false)}
            >
              <NavLink to="/#home" className="navlink">
                User Home
              </NavLink>
              <NavLink
                to={`/user-history/${userId}`}
                className="navlink"
                onClick={() => setDropdownOpen(false)}
              >
                History
              </NavLink>
              {userId && (
                <NavLink to="/#home" className="navlink">
                  <div className="user-info">
                    {profilePicture ? (
                      <div className="profile-container">
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="profile-pic"
                        />
                      </div>
                    ) : null}
                    <button
                      className="user-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown();
                      }}
                    >
                      Hi, {userName}
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-content">
                        <Link to="/change-password" className="dropdown">
                          Change Password
                        </Link>
                        <Link to="/change-profile-picture" className="dropdown">
                          Change Profile Picture
                        </Link>
                        <button
                          className="dropdown logout-button"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </NavLink>
              )}
            </div>
          )}

          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
