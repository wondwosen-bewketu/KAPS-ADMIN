import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Modal,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgentInfoAsync,
  updateAgentInfoAsync,
  selectAgentInfo,
} from "../../redux/slice/agentSlice";

const StyledPaper = styled(Paper)({
  padding: "40px",
  maxWidth: "1300px",
  margin: "auto",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
  background: "#f9f9f9",
});

const Title = styled(Typography)({
  fontSize: "36px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#333",
  textAlign: "center",
});

const Subtitle = styled(Typography)({
  fontSize: "18px",
  marginBottom: "10px",
  color: "#555",
});

const StyledDivider = styled(Divider)({
  backgroundColor: "#ccc",
  margin: "20px 0",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  marginRight: "10px", // Added margin for spacing
  background: "linear-gradient(45deg, #d7a022, #60a018)",
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #60a018, #d7a022)",
  },
});

const AgentInfoComponent = () => {
  const [img, setImg] = useState(null);
  const [files, setFiles] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { phone } = useParams();
  const agentInfo = useSelector(selectAgentInfo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAgentInfoAsync(phone));
  }, [dispatch, phone]);

  const handleUpdateInfo = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (img) {
        formData.append("img", img);
      }
      if (files) {
        // Append each file from the files array
        for (let i = 0; i < files.length; i++) {
          console.log({ files });
          formData.append(`files`, files[i]);
        }

        // files.forEach((file, index) => {
        //   console.log({ index });
        //   console.log({ files });
        //   formData.append(`files`, file);
        // });
      }
      await dispatch(updateAgentInfoAsync({ phone, formData }));
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating agent info:", error);
      setIsLoading(false);
    }
  };

  const handlePdfClick = () => {
    if (agentInfo && agentInfo.files && agentInfo.files.length > 0) {
      // Iterate over each file and open its URL in a new tab
      agentInfo.files.forEach((file) => {
        window.open(file.url, "_blank");
      });
    }
  };

  const handleAddProduct = () => {
    navigate(
      `/addProduct?phone=${agentInfo.phone}&location=${agentInfo.location}`
    );
  };

  console.log(agentInfo);

  return (
    <StyledPaper elevation={3}>
   
      {!isLoading && agentInfo && (
        <>
          <Title>{agentInfo.name}</Title>

          <StyledDivider />
          <ListItem>
            <ListItemAvatar>
              <Avatar
                alt="avatar"
                src={agentInfo.img.url}
                sx={{ width: 150, height: 150 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Subtitle>Phone: {agentInfo.phone}</Subtitle>
                  <Subtitle>Email: {agentInfo.email}</Subtitle>
                  <Subtitle>Location: {agentInfo.location}</Subtitle>
                  <Subtitle activated={agentInfo.restriction}>
                    <div
                      style={{
                        backgroundColor: agentInfo.restriction
                          ? "red"
                          : "green",
                        padding: "5px",
                        borderRadius: "5px",
                        color: "white",
                        display: "inline-block",
                      }}
                    >
                      {agentInfo.restriction ? "Deactivated" : "Activated"}
                    </div>
                  </Subtitle>

                  <Button variant="contained" onClick={handlePdfClick}>
                    Open File
                  </Button>
                </>
              }
            />
          </ListItem>
          <StyledDivider />
        </>
      )}
      <StyledButton variant="contained" onClick={handleUpdateInfo}>
        Edit Agent Information
      </StyledButton>
      <StyledButton variant="contained" onClick={handleAddProduct}>
        Add Product
      </StyledButton>{" "}
      {/* Added Add Product button */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 8,
            boxShadow: 24,
            p: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5" mb={2} align="center">
            Edit Agent Information
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" mb={1}>
              Upload Profile Photo
            </Typography>
            <input
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
              accept="image/*"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" mb={1}>
              Upload Verification Files
            </Typography>
            <input
              type="file"
              onChange={(e) => setFiles(e.target.files)} // Capture all selected files
              accept="image/*"
              multiple // Allow multiple file selection
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}{" "}
            {/* Change button text based on loading state */}
          </Button>
        </Box>
      </Modal>
    </StyledPaper>
  );
};

export default AgentInfoComponent;
