import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton, TextField, FormControl, Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { BASE_URL } from "../../api/baseURL";
import { useSelector } from "react-redux";

const ProfileForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isPasswordWeak, setIsPasswordWeak] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const { user } = useSelector((state) => state.user);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword.trim() === "") {
      setIsPasswordEmpty(true);
      return;
    } else {
      setIsPasswordEmpty(false);
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}user/changepassword/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setIsPasswordWeak(false);
        setIsPasswordWeak(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword(""); // Reset confirm password field
        setError("");
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Profile </h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <FormControl variant="outlined">
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Current Password"
            type={showPassword1 ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword1(!showPassword1)}
                  edge="end"
                >
                  {showPassword1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        </FormControl>

        <FormControl variant="outlined">
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            sx={{ mt: 1 }}
          />
        </FormControl>

        <FormControl variant="outlined">
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Confirm Password" // Label for confirm password field
            type={showPassword2 ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword2(!showPassword2)}
                  edge="end"
                >
                  {showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            sx={{ mt: 1 }}
          />
        </FormControl>

        {isPasswordWeak && (
          <label style={{ color: "red", padding: "5px" }}>
            New Password is not strong enough{" "}
          </label>
        )}
        {isPasswordEmpty && (
          <label style={{ color: "red", padding: "5px" }}>
            Fill the password
          </label>
        )}
        {error && (
          <label style={{ color: "red", padding: "5px" }}>{error}</label>
        )}

        <Button type="submit" variant="contained" style={buttonStyle}>
          Update Password
        </Button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

const containerStyle = {
  width: "400px",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif",
};

const titleStyle = {
  textAlign: "center",
  color: "#333",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const buttonStyle = {
  backgroundColor: "black",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

export default ProfileForm;
