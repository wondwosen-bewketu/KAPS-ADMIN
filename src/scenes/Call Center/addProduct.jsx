import { useState } from "react";
import { useDispatch } from "react-redux";
import { postItemAsync } from "../../redux/slice/productSlice";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
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
  color: theme.palette.secondary.main,
  marginRight: theme.spacing(1),
}));

const ProductForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productname: "",
    productprice: "",
    agentphone: "",
    productdescription: "",
    productlocation: "",
    file: null,
    url: "",
    quantity: "",
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

    const formDataToSend = new FormData();
    formDataToSend.append("productname", formData.productname);
    formDataToSend.append("productprice", formData.productprice);
    formDataToSend.append("agentphone", formData.agentphone);
    formDataToSend.append("productdescription", formData.productdescription);
    formDataToSend.append("productlocation", formData.productlocation);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("file", formData.file);

    formDataToSend.append("url", formData.url);

    await dispatch(postItemAsync(formDataToSend));

    // Optionally, you can clear the form after submission
    setFormData({
      productname: "",
      productprice: "",
      agentphone: "",
      productdescription: "",
      productlocation: "",
      file: null,
      quantity: "",
      url: "",
    });

    setLoading(false);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h5" color="secondary">
          Add Product
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 20 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                label="Product Name"
                name="productname"
                fullWidth
                value={formData.productname}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
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
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Agent Phone"
                name="agentphone"
                fullWidth
                value={formData.agentphone}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <StyledTextField
                label="Product Location"
                name="productlocation"
                fullWidth
                value={formData.productlocation}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <StyledTextField
                type="file"
                name="file"
                fullWidth
                onChange={handleFileChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CloudUploadIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                label="Video File URL"
                name="url"
                fullWidth
                value={formData.url}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
          </Grid>
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
          >
            {loading && <LoadingSpinner size={20} />}
            Add Product
          </StyledButton>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default ProductForm;
