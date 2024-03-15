import React, { useEffect, useState } from "react";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  const [userId, setUserId] = useState();
  const handleLogout = () => {
    // Clear localStorage items on logout
    toast.success("logged out");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    const role = localStorage.getItem("role") === "admin" ? true : false;
    const id = localStorage.getItem("userId");
    setIsAdmin(role);
    setUserId(id);
  }, []);

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
              <NavLink to="/editQuiz" className="navlink"> {/* Add this NavLink */}
    Edit Quiz
  </NavLink>
              <NavLink to="/login" className="navlink">
                <button className="btn" onClick={handleLogout}>
                  Logout  
                </button>
              </NavLink>
            </div>
          ) : (
            <div id="navLinks" className={`${menuOpen ? "open" : ""}`}>
              <NavLink to="/#home" className="navlink">
                User Home
              </NavLink>
              <NavLink to={`/user-history/${userId}`} className="navlink">
                History
              </NavLink>
              <NavLink to="/login" className="navlink">
                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              </NavLink>
            </div>
          )}

          {/* Hamburger menu button for mobile on the right side */}
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>
        </div>
      </nav>
    </>
  );
}