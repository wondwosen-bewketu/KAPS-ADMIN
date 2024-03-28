import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import logo from "../../assets/log.png";
import { useNavigate } from "react-router-dom";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  logo: {
    width: "80%",
    height: "auto",
    margin: theme.spacing(2, "auto"),
    filter: theme.palette.mode === "dark" ? "invert(100%)" : "none",
  },
  listItem: {
    color: "dark",

    "&:hover": {
      backgroundColor: "d7a022",
    },
  },
  listItemText: {
    fontSize: "1.2rem", // Adjust the font size for list items
  },
  icon: {
    fontSize: "3.5rem", // Adjust the font size for icons
  },
}));
const Sidebar = ({ userRole }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate();

  const handleItemClick = (title, to) => {
    setSelected(title);
    navigate(to);
  };

  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <List>
        <Box textAlign="center">
          <img src={logo} alt="Logo" className={classes.logo} />
        </Box>
        {userRole === "Super Admin" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Dashboard", "/dashboard")}
              selected={selected === "Dashboard"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Register User", "/registeruser")}
              selected={selected === "Register User"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Register User" />
            </ListItem>
          </>
        )}
        {userRole === "Finance" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Dashboard", "/dashboard")}
              selected={selected === "Dashboard"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() =>
                handleItemClick("Finance Approval", "/financeApproval")
              }
              selected={selected === "Finance Approval"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Finance Approval" />
            </ListItem>
          </>
        )}

        {userRole === "Oditor" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Dashboard", "/dashboard")}
              selected={selected === "Dashboard"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() =>
                handleItemClick("Oditor Approval", "/oditorApproval")
              }
              selected={selected === "Oditor Approval"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Oditor Approval" />
            </ListItem>
          </>
        )}

        {userRole === "General Manager" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Dashboard", "/dashboard")}
              selected={selected === "Dashboard"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() =>
                handleItemClick(
                  "General Manager Approval",
                  "/generalManagerApproval"
                )
              }
              selected={selected === "General Manager Approval"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="General Manager Approval" />
            </ListItem>
          </>
        )}

        {userRole === "Admin" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Dashboard", "/dashboard")}
              selected={selected === "Dashboard"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Approval", "/adminApproval")}
              selected={selected === "Approval"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Approval" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Manage Team", "/team")}
              selected={selected === "Manage Team"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Agnets" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Add Item", "/addItem")}
              selected={selected === "Add Item"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add Item" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Orders", "/orders")}
              selected={selected === "orders"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="orders" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Reports", "/reportDashboard")}
              selected={selected === "Reports"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Item List", "/items")}
              selected={selected === "Item List"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Item List" />
            </ListItem>
          </>
        )}
        {userRole === "Call Center" && (
          <>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Dashboard", "/dashboard")}
              selected={selected === "Dashboard"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Add New Agent", "/addAgent")}
              selected={selected === "Add New Agent"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add New Agent" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Agent Profile", "/agentLogin")}
              selected={selected === "Agent Profile"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Agent Profile" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Add Item", "/addItem")}
              selected={selected === "Add Item"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add Item" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Wearhouse", "/wearhouse")}
              selected={selected === "Wearhouse"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Wearhouse" />
            </ListItem>

            {/* <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Add Product", "/addProduct")}
              selected={selected === "Add Product"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add Product" />
            </ListItem> */}
            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Item List", "/items")}
              selected={selected === "Item List"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Item List" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
