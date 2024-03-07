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
    profilePhoto: null,
  });

  const [passwordValidationResult, setPasswordValidationResult] = useState("");
  const [emailValidationResult, setEmailValidationResult] = useState("");
  const [formValidation, setFormValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
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

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profilePhoto: e.target.files[0],
    }));
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        email: formData.email,
      });

      toast.success("OTP sent successfully");
      setShowOTPInput(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      toast.success("OTP verified successfully");
      setFormData((prevData) => ({
        ...prevData,
        isEmailVerified: true,
      }));
      setFormValidation(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid not Verified");
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
        if (!formData.isEmailVerified) {
          toast.error("Please verify your email address");
          return;
        }

        const formDataWithImage = new FormData();
        formDataWithImage.append("name", formData.name);
        formDataWithImage.append("email", formData.email);
        formDataWithImage.append("password", formData.password);
        formDataWithImage.append("otp", formData.otp);
        formDataWithImage.append("isEmailVerified", formData.isEmailVerified);

        // Append the profilePhoto only if it exists
        if (formData.profilePhoto) {
          formDataWithImage.append("profileImage", formData.profilePhoto);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/register`,
          formDataWithImage
        );


        if (response.status === 201) {
          toast.success("Registered Successfully!");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);

      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
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
                  setShowOTPInput(false);
                }}
              />
              {emailValidationResult && (
                <font color="#FF4B4B">{emailValidationResult}</font>
              )}

              {showOTPInput && (
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

              {formValidation ? (
                <>{/* Rendered when OTP is verified */}</>
              ) : (
                <>
                  <button
                    className="btn"
                    onClick={handleSendOTP}
                    disabled={!formData.email || loading}
                  >
                    Send OTP
                  </button>
                </>
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
                  validator();
                }}
              />
            </div>

            <div className="wrap-input validate-input">
              <input
                type="file"
                name="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
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
