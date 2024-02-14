import React, { useState } from "react";
import "./Navbar.css";
// import Logo from '../../assets/Logo.png';
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
const isAdmin = false;
  return (
    <>
      <nav id="admin-navbar" className={`${menuOpen ? "open" : ""}`}>
        <div className="nav-wrapper">
          <div className="logo">
            {/* <img width="200px" height="auto" src={Logo} alt="Logo" /> */}
            QuizIT
          </div>

          {isAdmin ? (
            <div id="navLinks" className={`${menuOpen ? "open" : ""}`}>
              <NavLink to="/admin#home" className="navlink">
                Admin Home
              </NavLink>
              <NavLink to="/admin/add-quiz" className="navlink">
                Add Quiz
              </NavLink>
              <NavLink to="/admin/user-history" className="navlink">
                User History
              </NavLink>
              <NavLink to="/login" className="navlink">
                <button className="btn">Logout</button>
              </NavLink>
            </div>
          ) : (
            <div id="navLinks" className={`${menuOpen ? "open" : ""}`}>
              <NavLink to="/#home" className="navlink">
                Home
              </NavLink>

              <NavLink to="/user/history" className="navlink">
                History
              </NavLink>
              <NavLink to="/login" className="navlink">
                <button className="btn">Logout</button>
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
