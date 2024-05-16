// components/RegisterUserForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postUserAsync } from "../../redux/slice/userSlice";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterUserForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    role: "Admin", // Default role
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(postUserAsync(formData));
      toast.success("User registered successfully!");
      // Reset the form after successful registration
      setFormData({
        fullName: "",
        phoneNumber: "",
        password: "",
        role: "Admin",
      });
    } catch (error) {
      console.error("Error registering user:", error.message);
      toast.error("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register User
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Call Center">Call Center</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Oditor">Oditor</MenuItem>
                  <MenuItem value="General Manager">General Manager</MenuItem>
                  <MenuItem value="Store">Store</MenuItem>
                  <MenuItem value="Quality Assurance">
                    Quality Assurance
                  </MenuItem>
                  <MenuItem value="Inventory">Inventory</MenuItem>
                  
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Paper>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        draggable
        closeOnClick
      />
    </Container>
  );
};

export default RegisterUserForm;
