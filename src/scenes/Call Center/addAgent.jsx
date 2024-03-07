import { useState } from "react";
import { useDispatch } from "react-redux";
import { postAgentAsync } from "../../redux/slice/userSlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Grid,
  Paper,
  Typography,
  Input,
  InputLabel,
  IconButton,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import regionsAndCitiesData from "./regionsAndCityData.json";

const AgentForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    restriction: true,
    img: null,
    files: null,
    region: "",
    city: "",
    location: "",
    bankName: "",
    accNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "region") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === "city") {
      setFormData({
        ...formData,
        city: value,
        location: `${formData.region},${value}`,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImgChange = (e) => {
    setFormData({
      ...formData,
      img: e.target.files[0],
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataWithFile = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "img" || key === "files") {
        formDataWithFile.append(key, value);
      } else {
        formDataWithFile.append(key, value.toString());
      }
    });

    dispatch(postAgentAsync(formDataWithFile));

    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      restriction: true,
      img: null,
      files: null,
      region: "",
      city: "",
      location: "",
      bankName: "",
      accNumber: "",
    });

    toast.success("Form submitted successfully!");
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
          Agent Form
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel
                htmlFor="img-upload"
                style={{
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <Input
                  id="img-upload"
                  type="file"
                  name="img"
                  fullWidth
                  onChange={handleImgChange}
                  required
                  style={{ display: "none" }}
                />
                <IconButton color="primary" component="span">
                  <CloudUploadIcon />
                </IconButton>
                Upload Image
              </InputLabel>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
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
              <TextField
                label="Bank Name"
                name="bankName"
                fullWidth
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Account Number"
                name="accNumber"
                fullWidth
                value={formData.accNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel
                htmlFor="file-upload"
                style={{
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <Input
                  id="file-upload"
                  type="file"
                  name="files"
                  fullWidth
                  onChange={handleFileChange}
                  required
                  style={{ display: "none" }}
                />
                <IconButton color="primary" component="span">
                  <CloudUploadIcon />
                </IconButton>
                Upload File
              </InputLabel>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="region">Region</InputLabel>
                <Select
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
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="city">City</InputLabel>
                <Select
                  id="city"
                  name="city"
                  fullWidth
                  value={formData.city}
                  onChange={handleChange}
                >
                  {regionsAndCitiesData.regions
                    .find((item) => item.name === formData.region)
                    ?.cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.restriction}
                    onChange={handleCheckboxChange}
                    name="restriction"
                  />
                }
                label="Restriction"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AgentForm;
