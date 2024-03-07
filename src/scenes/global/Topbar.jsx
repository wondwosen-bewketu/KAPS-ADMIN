import { useContext, useState } from "react";
import InputBase from "@mui/material/InputBase";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Popover,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import { toast } from "react-toastify"; // Import the toast module
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../../redux/slice/userSlice";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful"); // Display success toast for logout
    navigate("/login");
    setAnchorEl(null); // Close the popover after logout
  };

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      backgroundColor="#efefef" // Set your desired background color here
    >
      <Box display="flex" borderRadius="3px" backgroundColor="#d7a022">
        {/* Add your search bar component here if needed */}
      </Box>

      {/* ICONS */}
      <Box display="flex" color="#d7a022" alignItems="center">
        <IconButton
          onClick={handleUserIconClick}
          sx={{ color: "#d7a022" }}
        >
          <PersonOutlinedIcon />
        </IconButton>

        {/* Display the username next to the user profile icon */}
        {user && (
          <Typography variant="body2" color="#d7a022" sx={{ mr: 1 }}>
            {user.fullName} - {user.role}
          </Typography>
        )}

        {/* User Information Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Paper>
            <List>
              {user && (
                <>
                  <ListItem>
                    <ListItemText primary={`Name: ${user.fullName}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Role: ${user.role}`} />
                  </ListItem>
                  <Divider />
                </>
              )}
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Paper>
        </Popover>
      </Box>
    </Box>
  );
};

export default Topbar;
