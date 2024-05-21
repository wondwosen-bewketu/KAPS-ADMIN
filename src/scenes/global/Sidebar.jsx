import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import logo from "../../assets/log.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocationsAsync,
  selectWearhouseInfo,
} from "../../redux/slice/wearhouseSlice";
import socketIOClient from "socket.io-client";

export const socket = socketIOClient("https://kaps-api.purposeblacketh.com/");

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
  const wearhouseInfo = useSelector(selectWearhouseInfo);
  const navigate = useNavigate();

  const [datas, setDatas] = useState([]);
  const [isNewData, setIsNewData] = useState(false);
  const [datasWarehouse, setDatasWarehouse] = useState([]);
  const [isNewDataWarehouse, setIsNewDataWarehouse] = useState(false);
  const [datasProduct, setDatasProduct] = useState([]);
  const [isNewDataProduct, setIsNewDataProduct] = useState(false);

  useEffect(() => {
    //agent socket
    socket.emit("initial_data");
    socket.on("get_data", getData);
    socket.on("change_data", changeData);
    //warehouse socket
    socket.emit("initial_Warehouse_data");
    socket.on("get_Warehouse_data", getDataWarehouse);
    socket.on("change_Warehouse_data", changeDataWarehouse);
    //product socket
    socket.emit("initial_Product_data");
    socket.on("get_Product_data", getDataProduct);
    socket.on("change_Product_data", changeDataProduct);
    return () => {
      //agent socket
      socket.off("get_data");
      socket.off("change_data");
      //warehouse socket
      socket.off("get_Warehouse_data");
      socket.off("change_Warehouse_data");
      //product socket
      socket.off("get_Product_data");
      socket.off("change_Product_data");
    };
  }, []);

  const getData = (datas) => {
    if (datas.length && datas.some((data) => data.read === false)) {
      setIsNewData(true);
    } else {
      setIsNewData(false);
    }
    setDatas(datas);
  };

  const getDataWarehouse = (datasWarehouse) => {
    if (
      datasWarehouse.length &&
      datasWarehouse.some((data) => data.read === false)
    ) {
      setIsNewDataWarehouse(true);
    } else {
      setIsNewDataWarehouse(false);
    }
    setDatasWarehouse(datasWarehouse);
  };

  const getDataProduct = (datasProduct) => {
    if (
      datasProduct.length &&
      datasProduct.some((data) => data.read === false)
    ) {
      setIsNewDataProduct(true);
    } else {
      setIsNewDataProduct(false);
    }
    setDatasProduct(datasProduct);
  };

  const changeData = () => socket.emit("initial_data");
  const changeDataWarehouse = () => socket.emit("initial_Warehouse_data");
  const changeDataProduct = () => socket.emit("initial_Product_data");

  const handleItemClick = (title, to) => {
    if (title === "Wearhouse") {
      socket.emit("check_all_Warehouse_notifications");
    }
    if (title === "Manage Team") {
      socket.emit("check_all_notifications");
    }
    if (title === "Item List") {
      socket.emit("check_all_Product_notifications");
    }

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

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Products Log", "/productslog")}
              selected={selected === "Products Log"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Products Log" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Users List", "/users")}
              selected={selected === "Users List"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Users List" />
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Agents List", "/team")}
              selected={selected === "Users List"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Agents List" />
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
                <Badge
                  color="error"
                  badgeContent={
                    isNewData ? datas.filter((data) => !data.read).length : 0
                  }
                >
                  <GroupIcon sx={{ color: "#d7a022" }} />
                </Badge>
                {/* <GroupIcon /> */}
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
                <Badge
                  color="error"
                  badgeContent={
                    isNewDataProduct
                      ? datasProduct.filter((data) => !data.read).length
                      : 0
                  }
                >
                  <ListAltIcon sx={{ color: "#d7a022" }} />
                </Badge>
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
              onClick={() => handleItemClick("Wearhouse", "/warehouse")}
              selected={selected === "Wearhouse"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <Badge
                  color="error"
                  badgeContent={
                    isNewDataWarehouse
                      ? datasWarehouse.filter((data) => !data.read).length
                      : 0
                  }
                >
                  <AddCircleOutlineIcon sx={{ color: "#d7a022" }} />
                </Badge>
              </ListItemIcon>

              <ListItemText primary="Wearhouse" />
              {/* </Badge> */}
            </ListItem>

            <ListItem
              className={classes.listItem}
              onClick={() => handleItemClick("Item List", "/items")}
              selected={selected === "Item List"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <Badge
                  color="error"
                  badgeContent={
                    isNewDataProduct
                      ? datasProduct.filter((data) => !data.read).length
                      : 0
                  }
                >
                  <ListAltIcon sx={{ color: "#d7a022" }} />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Item List" />
            </ListItem>
          </>
        )}
        {userRole === "Store" && (
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
              onClick={() => handleItemClick("Store", "/store")}
              selected={selected === "Store"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Store" />
            </ListItem>
          </>
        )}

        {userRole === "Quality Assurance" && (
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
                handleItemClick("Quality Assurance Users", "/qualityAssurances")
              }
              selected={selected === "Quality Assurance Users"}
              button
            >
              <ListItemIcon style={{ color: "#d7a022" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Quality Assurance Users" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
