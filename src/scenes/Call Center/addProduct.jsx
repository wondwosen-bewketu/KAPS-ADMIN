import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postItemAsync } from "../../redux/slice/productSlice";
import { fetchAdminItems } from "../../redux/slice/itemSlice";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: theme.palette.background.default,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& label.Mui-focused": {
    color: theme.palette.secondary.main,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: theme.palette.secondary.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.secondary.main,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.secondary.light,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.secondary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  background: theme.palette.secondary.main,
  "&:hover": {
    background: theme.palette.secondary.light,
  },
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: "#60a018",
  marginRight: theme.spacing(1),
}));

const ProductForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const items = useSelector((state) => state.items.items);

  useEffect(() => {
    dispatch(fetchAdminItems());
  }, [dispatch]);

  const queryParams = new URLSearchParams(window.location.search);
  const phone = queryParams.get("phone");
  const location = queryParams.get("location");

  // Decode the phone and location values
  const decodedPhone = phone
    ? decodeURIComponent(phone).replace(/\+/g, "")
    : "";

  const decodedLocation = location ? decodeURIComponent(location) : "";

  const [formData, setFormData] = useState({
    productname: "",
    productprice: "",
    agentphone: decodedPhone,
    productdescription: "",
    productlocation: decodedLocation,
    file: null,
    url: "",
    quantity: "",
    unit: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFormData({
      ...formData,
      file: selectedFile,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("productname", formData.productname);
      formDataToSend.append("productprice", formData.productprice);
      formDataToSend.append("agentphone", formData.agentphone);
      formDataToSend.append("productdescription", formData.productdescription);
      formDataToSend.append("productlocation", formData.productlocation);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("file", formData.file);
      formDataToSend.append("url", formData.url);

      await dispatch(postItemAsync(formDataToSend));

      toast.success("Product added successfully");
      setFormData({
        productname: "",
        productprice: "",
        agentphone: "",
        productdescription: "",
        productlocation: "",
        file: null,
        quantity: "",
        unit: "",
        url: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "No image file provided"
      ) {
        toast.error("Please select an image file");
      } else {
        toast.error("Failed to add product");
      }
    }

    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h4" color="#60a018">
          Add Product
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 20 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="productname">Product Name</InputLabel>
                <Select
                  label="Product Name"
                  id="productname"
                  name="productname"
                  value={formData.productname}
                  onChange={handleChange}
                >
                  {items.map((item) => (
                    <MenuItem key={item.id} value={item.itemname}>
                      {item.itemname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="catagory">catagory</InputLabel>
                <Select
                  label="catagory"
                  id="catagory"
                  name="catagory"
                  value={formData.catagory}
                  required
                  onChange={handleChange}
                >
                  <MenuItem value="Vigitables">Vigitables</MenuItem>
                  <MenuItem value="CornsAndCereals">Corns And Cereals</MenuItem>
                  <MenuItem value="Commodities">Commodities</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Product Price"
                name="productprice"
                fullWidth
                type="number"
                value={formData.productprice}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Birr</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Agent Phone"
                name="agentphone"
                fullWidth
                value={formData.agentphone}
                onChange={handleChange}
                required
                variant="outlined"
                disabled // Disable agent phone field
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Product Description"
                name="productdescription"
                fullWidth
                value={formData.productdescription}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            {/* Right Column */}

            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Product Location"
                name="productlocation"
                fullWidth
                value={formData.productlocation}
                required
                variant="outlined"
                disabled // Disable product location field
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Product Quantity"
                    name="quantity"
                    fullWidth
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth required variant="outlined">
                    <InputLabel htmlFor="unit">Unit</InputLabel>
                    <Select
                      label="Unit"
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <MenuItem value="kg">kg</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                      <MenuItem value="Tons">Tons</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Video File URL"
                name="url"
                fullWidth
                value={formData.url}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                type="file"
                name="file"
                fullWidth
                onChange={handleFileChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CloudUploadIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent="center">
            <Grid item xs={12} sm={6}>
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={
                  loading ? <LoadingSpinner size={20} /> : <CloudUploadIcon />
                }
              >
                {loading ? "Adding Product..." : "Add Product"}
              </StyledButton>
            </Grid>
          </Grid>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default ProductForm;