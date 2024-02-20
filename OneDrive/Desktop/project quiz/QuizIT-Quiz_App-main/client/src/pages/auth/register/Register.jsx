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
  });

  const [passwordValidationResult, setPasswordValidationResult] = useState("");
  const [formValidation, setFormValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validator = () => {
    const validPasswordString = passwordValidations.validatePassword(
      formData.password
    );

    if (validPasswordString === true) {
      setFormValidation(true);
      setPasswordValidationResult("");
    } else {
      setFormValidation(false);
      setPasswordValidationResult(validPasswordString);
    }
  };

 const handleChange = (e) => {
   setFormData((prevData) => ({
     ...prevData,
     [e.target.name]: e.target.value,
   }));
 };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      formData
    );


      console.log("Registration successful. Response:", response.data);

      if (response.status === 200) {
        toast.success(`Registered Successfully!`);
        navigate("/login");
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
                onChange={handleChange}
              />
            </div>

            <div className="wrap-input validate-input">
              {passwordValidationResult && (
                <font color="white">{passwordValidationResult}</font>
              )}
              <input
                className="input100"
                type="password"
                name="password"
                placeholder="************"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  validator();
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
              <span className="txt1">Don't have an account? </span>{" "}
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
