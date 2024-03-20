import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import passwordValidations from "../../../validations/passwordValidation";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    isEmailVerified: false,
  });

  const [passwordValidationResult, setPasswordValidationResult] = useState("");
  const [emailValidationResult, setEmailValidationResult] = useState("");
  const [formValidation, setFormValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSendOTPButton, setShowSendOTPButton] = useState(true);
  const [showVerifyOTPButton, setShowVerifyOTPButton] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const validator = () => {
    const validPasswordString = passwordValidations.validatePassword(
      formData.password
    );
    const validEmailString = passwordValidations.validateEmail(formData.email);

    if (validPasswordString === true && validEmailString === true) {
      setFormValidation(true);
      setPasswordValidationResult("");
      setEmailValidationResult("");
    } else {
      setFormValidation(false);
      setPasswordValidationResult(validPasswordString);
      setEmailValidationResult(validEmailString);
    }
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

const handleSendOTP = async () => {
  try {
    setLoading(true); // Start loading

    // Send request to server to send OTP to the provided email
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
      email: formData.email,
    });

    toast.success("OTP sent successfully");
    setShowSendOTPButton(false); // Hide Send OTP button after sending OTP
    setShowVerifyOTPButton(true); // Show Verify OTP button after sending OTP
  } catch (error) {
    console.error("Error sending OTP:", error);
    toast.error("Failed to send OTP");
  } finally {
    setLoading(false); // Stop loading
  }
};


  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      // Send request to server to verify the provided OTP
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      toast.success("OTP verified successfully");
      setFormData((prevData) => ({
        ...prevData,
        isEmailVerified: true,
      }));
      setOtpVerified(true);
      setShowVerifyOTPButton(false); // Hide Verify OTP button after successful verification
      setFormValidation(true); // Enable registration after successful OTP verification
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      validator();

      if (formValidation) {
        // Check if email is verified before registering
        if (!formData.isEmailVerified) {
          toast.error("Please verify your email address");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/register`,
          formData
        );

        console.log("Registration successful. Response:", response.data);

        if (response.status === 201) {
          // Show a success toast upon successful registration
          toast.success("Registered Successfully!");

          // Redirect to the login page after successful registration
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        // Show a user-friendly error message
        toast.error(error.response.data.error || "Registration failed");
      } else if (error.request) {
        console.error("No response received from the server");
        toast.error("Registration failed");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-form">
            <span className="login100-form-title p-b-26">Welcome</span>
            <div className="wrap-input validate-input">
              <input
                className="input100"
                type="text"
                name="name"
                placeholder="john Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="wrap-input validate-input">
              <input
                className="input100"
                type="email"
                name="email"
                placeholder="john@gmail.com"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  setEmailValidationResult("");
                }}
              />
              {emailValidationResult && (
                <font color="#FF4B4B">{emailValidationResult}</font>
              )}

              {/* Add OTP input and buttons */}
              {showSendOTPButton && (
                <div>
                  <button
                    className="btn"
                    onClick={handleSendOTP}
                    disabled={!formData.email || loading}
                  >
                    Send OTP
                  </button>
                  {loading && <div className="loader">Loading...</div>}
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
                    disabled={!formData.otp || loading}
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {otpVerified && (
                <font color="green">OTP successfully verified</font>
              )}
            </div>

            <div className="wrap-input validate-input">
              {passwordValidationResult && (
                <font color="#FF4B4B">{passwordValidationResult}</font>
              )}
              <input
                className="input100"
                type="password"
                name="password"
                placeholder="************"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  setPasswordValidationResult("");
                  validator(); // Call validator on password change
                }}
              />
            </div>

            <div className="btn-container">
              <button
                className="btn login-btn"
                onClick={handleRegister}
                disabled={!formValidation || loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
            <div className="text-center p-t-115">
              <span className="txt1">Already have an account? </span>{" "}
              <Link to="/login" className="txt2">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;