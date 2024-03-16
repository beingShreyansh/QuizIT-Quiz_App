import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import toast from "react-hot-toast";
import Modal from "react-modal";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const handleLogout = () => {
    toast.success("Logged out");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChangePasswordClick = () => {
    setPasswordModalOpen(true);
  };

  const handleChangeProfilePictureClick = () => {
    setProfilePictureModalOpen(true);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setChangePasswordError("New passwords do not match");
      return;
    }

    const changePasswordUrl = `${
      import.meta.env.VITE_API_URL
    }/auth/change-password`;

    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      userId,
      currentPassword: oldPassword,
      newPassword,
    };

    axios
      .post(changePasswordUrl, data, { headers })
      .then((response) => {
        toast.success("Password changed successfully");
        setPasswordModalOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setChangePasswordError("");
      })
      .catch((error) => {
        setChangePasswordError("Failed to change password. Please try again.");
      });
  };
 const handlePut = async () => {
   console.log(selectedImage);
   try {
     const signedUrlResponse = await axios.get(
       `${import.meta.env.VITE_API_URL}/auth/get-signed-url`,
       {
         params: {
           fileName: selectedImage.name,
           contentType: selectedImage.type,
         },
       }
     );

     const putResponse = await axios.put(
       signedUrlResponse.data.signedUrl,
       selectedImage,
       {
         headers: {
           "Content-Type": "image/jpeg",
         },
       }
     );

     console.log("Response status:", putResponse.status);

     if (putResponse.status === 200) {
       console.log("Image uploaded successfully");

       // Update imageId for the user
       const updateResponse = await axios.put(
         `${import.meta.env.VITE_API_URL}/auth/putImageId/${
           signedUrlResponse.data.imageId
         }`,
         { userId }
       );

       toast.success("Image uploaded successfully");
     }
   } catch (error) {
     console.error("Error uploading image:", error);
   }
 };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  useEffect(() => {
    const role = localStorage.getItem("role") === "admin";
    const id = localStorage.getItem("userId");
    setIsAdmin(role);
    setUserId(id);

    if (!role && id) {
      const userDetailsApiUrl = `${
        import.meta.env.VITE_API_URL
      }/user/getUserDetails/${id}`;
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      axios
        .get(userDetailsApiUrl, { headers })
        .then((response) => {
          const { name, profilePicture } = response.data;
          setUserName(name);
          setProfilePicture(
            profilePicture ||
              "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
          );
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
              <NavLink to="/editQuiz" className="navlink">
                Edit Quiz
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
              <div>
                {userId && (
                  <NavLink to="/#home" className="navlink">
                    <div
                      className="user-info"
                      onMouseEnter={toggleDropdown}
                      onMouseLeave={toggleDropdown}
                    >
                      <div className="profile-container">
                        {profilePicture && (
                          <div className="profile-container">
                            <img
                              src={profilePicture}
                              alt="Profile"
                              className="profile-pic"
                            />
                          </div>
                        )}
                        <span className="user-name">Hi, {userName}</span>
                      </div>
                      {dropdownOpen && (
                        <div className="dropdown-content">
                          <span
                            className="dropdown-item"
                            onClick={handleChangePasswordClick}
                          >
                            Change Password
                          </span>
                          <br />
                          <span
                            className="dropdown-item"
                            onClick={handleChangeProfilePictureClick}
                          >
                            Change Picture
                          </span>
                          <Link to="/login" className="dropdown">
                            <span
                              className="dropdown-item"
                              onClick={handleLogout}
                            >
                              Logout
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </NavLink>
                )}
              </div>
            </div>
          )}

          <div
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>
        </div>
      </nav>
      {/* Modal for Changing Password */}
      <Modal
        isOpen={passwordModalOpen}
        onRequestClose={() => setPasswordModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <span
          className="modal-close"
          onClick={() => setPasswordModalOpen(false)}
        >
          &times;
        </span>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {changePasswordError && <p className="error">{changePasswordError}</p>}
        <button className="change-password-btn" onClick={handleChangePassword}>
          Change Password
        </button>
      </Modal>
      {/* Modal for Changing Profile Picture */}
      <Modal
        isOpen={profilePictureModalOpen}
        onRequestClose={() => setProfilePictureModalOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <span
          className="modal-close"
          onClick={() => setProfilePictureModalOpen(false)}
        >
          &times;
        </span>
        <h2>Change Profile Picture</h2>
        <div className="avatar-container">
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Image"
              className="avatar"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Handle file selection
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            Choose Image
          </label>
        </div>
        <button className="upload-btn" onClick={handlePut}>
          Upload
        </button>
        {uploadError && <p className="error">{uploadError}</p>}
      </Modal>
    </>
  );
};

export default Navbar;
