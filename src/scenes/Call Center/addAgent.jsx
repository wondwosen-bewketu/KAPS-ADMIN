import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { postAgentAsync } from "../../redux/slice/userSlice";
import {
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import regionsAndCitiesData from "./regionsAndCityData.json";
import { styled } from "@mui/system";
import {socket} from "../global/Sidebar"

const StyledContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  marginTop: "-50px", // Negative margin-top
});

const StyledPaper = styled(Paper)({
  padding: "30px",
  width: "800px",
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)", // Box shadow for a raised effect
});

const StyledTypography = styled(Typography)({
  marginBottom: "20px",
  textAlign: "center",
});

const StyledFormControl = styled(FormControl)({
  width: "100%",
  marginBottom: "20px",
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.8)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#4CAF50",
  },
});

const StyledSelect = styled(Select)({
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.8)",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  width: "100%",
  borderRadius: "20px",
  padding: "12px",
  fontWeight: "bold",
  fontSize: "16px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  background: "#d7a022",
  color: "white",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  transition: "background-color 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
  },
});

const AgentForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    region: "",
    city: "",
    woreda: "", // Added woreda field
    bankName: "",
    accNumber: "",
  });

  const [woredaOptions, setWoredaOptions] = useState([]); // State for woreda options

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "region") {
      setFormData({
        ...formData,
        [name]: value,
        city: "", // Reset city when region changes
        woreda: "", // Reset woreda when region changes
        location: "", // Reset location when region changes
      });
      setWoredaOptions([]); // Clear woreda options when region changes
    } else if (name === "city") {
      const selectedCity = regionsAndCitiesData.regions
        .find((item) => item.name === formData.region)
        ?.cities.find((city) => city === value);
      setFormData({
        ...formData,
        city: value,
        woreda: "", // Reset woreda when city changes
        location: `${formData.region},${value}`, // Update location with region and city
      });
      setWoredaOptions(Array.from({ length: 20 }, (_, i) => String(i + 1))); // Assuming woredas are from 1 to 20
    } else if (name === "woreda") {
      setFormData({
        ...formData,
        [name]: value,
        location: `${formData.region},${formData.city},${value}`, // Update location with region, city, and woreda
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

 
// Inside your functional component...
useEffect(() => {
  // Function to handle successful form submission
  const handlePostDataSuccess = (data) => {
    toast.success(data.message);
    setFormData({
      name: "",
      phone: "",
      email: "",
      region: "",
      city: "",
      woreda: "",
      bankName: "",
      accNumber: "",
    });
  };

  // Function to handle form submission errors
  const handlePostDataError = (error) => {
    toast.error(error.error || "Failed to Register Agent. Please try again.");
  };

  // Set up event listeners only once when the component mounts
  socket.on("post_data_success", handlePostDataSuccess);
  socket.on("post_data_error", handlePostDataError);

  // Clean up event listeners when component unmounts
  return () => {
    socket.off("post_data_success", handlePostDataSuccess);
    socket.off("post_data_error", handlePostDataError);
  };
}, []); // Empty dependency array means this effect only runs once after the initial render

// Rest of your functional component...
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    formData && socket.emit("post_data", formData);
  } catch (error) {
    console.error("Error submitting form:", error);

    if (error.payload) {
      // Display the specific error message received from the server
      toast.error(
        error.payload.message || "Failed to Register Agent. Please try again."
      );
    } else {
      // Fallback error message
      toast.error("Failed to Register Agent. Please try again.");
    }
  }
};
  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <StyledTypography variant="h5">Agent Form</StyledTypography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <StyledTextField
                label="Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                label="Phone"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </Grid>
            {/* <Grid item xs={6}>
              <StyledTextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </Grid> */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <InputLabel htmlFor="region">Region</InputLabel>
                    <StyledSelect
                      id="region"
                      name="region"
                      fullWidth
                      value={formData.region}
                      onChange={handleChange}
                    >
                      {regionsAndCitiesData.regions.map((region) => (
                        <MenuItem key={region.name} value={region.name}>
                          {region.name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </StyledFormControl>
                </Grid>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <InputLabel htmlFor="city">City</InputLabel>
                    <Select
                      id="city"
                      name="city"
                      fullWidth
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                      {regionsAndCitiesData.regions
                        .find((item) => item.name === formData.region)
                        ?.cities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                    </Select>
                  </StyledFormControl>
                </Grid>
                <Grid item xs={4}>
                  <StyledFormControl>
                    <InputLabel htmlFor="woreda">Woreda</InputLabel>
                    <Select
                      id="woreda"
                      name="woreda"
                      fullWidth
                      value={formData.woreda}
                      onChange={handleChange}
                      required
                    >
                      {woredaOptions.map((woreda) => (
                        <MenuItem key={woreda} value={woreda}>
                          {woreda}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <StyledFormControl>
                <InputLabel htmlFor="bankName">Bank Name</InputLabel>
                <StyledSelect
                  id="bankName"
                  name="bankName"
                  fullWidth
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Bank of Abyssinia">
                    Bank of Abyssinia
                  </MenuItem>
                  <MenuItem value="Commercial Bank Of Ethiopia">
                    Commercial Bank Of Ethiopia
                  </MenuItem>
                  <MenuItem value="Wegagen Bank">Wegagen Bank</MenuItem>
                  <MenuItem value="Dashen Bank">Dashen Bank</MenuItem>
                  <MenuItem value="Awash Bank">Awash Bank</MenuItem>
                </StyledSelect>
              </StyledFormControl>
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                label="Account Number"
                name="accNumber"
                fullWidth
                value={formData.accNumber}
                onChange={handleChange}
                required
                variant="outlined"
                color="primary"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledButton type="submit">Submit</StyledButton>
            </Grid>
          </Grid>
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
      </StyledPaper>
    </StyledContainer>
  );
};

export default AgentForm;
