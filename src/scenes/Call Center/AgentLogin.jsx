import { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAgentInfoAsync } from "../../redux/slice/agentSlice";

const StyledPaper = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px", // Increase padding
  maxWidth: "900px",
  margin: "auto",
  marginTop: "100px", // Increase marginTop
  borderRadius: "10px",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
  color: "#d7a022",
});

const StyledIcon = styled(LockOutlinedIcon)({
  fontSize: "64px",
  marginBottom: "20px",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  background: "linear-gradient(45deg, #d7a022, #60a018)",
  color: "black",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #60a018, #d7a022)",
  },
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "black",
  },
  "& .MuiInputLabel-root": {
    color: "black",
  },
  "& .MuiInputBase-input": {
    color: "black",
  },
});

const AgentFormComponent = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetAgent = async () => {
    try {
      await dispatch(fetchAgentInfoAsync(phone)); // Dispatch action to fetch agent profile
      setError(""); // Clear any previous error
      navigate(`/agentInfo/${phone}`); // Navigate to agent info page with phone parameter
    } catch (error) {
      setError("Error fetching agent profile. Please try again."); // Set error message
    }
  };

  return (
    <StyledPaper elevation={5}>
      <StyledIcon />
      <Typography variant="h4" align="center" gutterBottom>
        Agent Profile
      </Typography>
      <StyledTextField
        label="Phone"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        margin="normal"
      />
      {error && (
        <Typography variant="body2" align="center" style={{ color: "red" }}>
          {error}
        </Typography>
      )}
      <StyledButton variant="contained" fullWidth onClick={handleGetAgent}>
        Get Agent
      </StyledButton>
    </StyledPaper>
  );
};

export default AgentFormComponent;
