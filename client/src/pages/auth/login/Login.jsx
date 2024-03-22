import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import Modal from "react-modal";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    isEmailVerified: false,
  });
  const [showSendOTPButton, setShowSendOTPButton] = useState(true);
  const [showVerifyOTPButton, setShowVerifyOTPButton] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        email: formData.email,
      });
      setIsLoading(false);
      setShowSendOTPButton(false);
      setShowVerifyOTPButton(true);
      toast.success("OTP sent successfully");
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      setIsLoading(false);
      setShowSendOTPButton(false);
      setShowVerifyOTPButton(false);
      setOtpVerified(true);
      setFormData((prevData) => ({
        ...prevData,
        isEmailVerified: true,
      }));
      toast.success("OTP verified successfully");
    } catch (error) {
      setIsLoading(false);
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP");
    }
  };

  const handleForgetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setChangePasswordError("New passwords do not match");
        return;
      }

      const forgetPasswordUrl = `${
        import.meta.env.VITE_API_URL
      }/auth/forget-password`;

      const accessToken = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const data = {
        email: formData.email,
        newPassword,
      };

      const response = await axios.post(forgetPasswordUrl, data, { headers });

      if (response.status === 200) {
        toast.success("Password changed successfully");
        setPasswordModalOpen(false);
        setFormData({
          ...formData,
          password: "",
        });
        setNewPassword("");
        setConfirmPassword("");
        setChangePasswordError("");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setChangePasswordError("Failed to change password. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      if (response.status === 201) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userId", response.data.userId);
        setIsLoading(false);
        if (response.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        toast.success("Successfully logged in!");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 402) {
        toast.error("User doesn't Exist");
      } else if (error.response.status === 401) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="limiter">
            <div className="container-login100">
              <div className="wrap-login100">
                <div className="login100-form">
                  <span className="login100-form-title p-b-26">Welcome</span>
                  <div className="wrap-input validate-input">
                    <input
                      className="input100"
                      type="email"
                      name="email"
                      placeholder="john@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="wrap-input validate-input">
                    <input
                      className="input100"
                      type="password"
                      name="password"
                      placeholder="************"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="btn-container">
                    <button className="btn login-btn" onClick={handleLogin}>
                      Login
                    </button>
                  </div>
                  <div className="text-center p-t-20">
                    <button
                      className="forgot-password"
                      onClick={() => setPasswordModalOpen(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="text-center p-t-20">
                    <span className="txt1">Don't have an account? </span>
                    <Link to="/register" className="txt2">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
            <h2>Reset Password</h2>
            <div className="wrap-input validate-input">
              <input
                type="email"
                placeholder="Email for Verification"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            {showSendOTPButton && (
              <div>
                <button
                  className="btn"
                  onClick={handleSendOTP}
                  disabled={!formData.email || isLoading}
                >
                  Send OTP
                </button>
                {isLoading && <div className="loader">Loading...</div>}
              </div>
            )}
            {showVerifyOTPButton && (
              <div>
                <input
                  className="input100"
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
                <button
                  className="btn"
                  onClick={handleVerifyOTP}
                  disabled={!formData.otp || isLoading}
                >
                  Verify OTP
                </button>
              </div>
            )}
            {otpVerified && (
              <font color="green">OTP successfully verified</font>
            )}
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
            {changePasswordError && (
              <p className="error">{changePasswordError}</p>
            )}
            <button
              className="change-password-btn"
              onClick={handleForgetPassword}
            >
              Reset Password
            </button>
          </Modal>
        </>
      )}
    </>
  );
}

export default Login;

