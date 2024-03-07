import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { setUser } from "./redux/slice/userSlice";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Items from "./scenes/item/index";
import AddItem from "./scenes/item/addItemForm";
import AddAgent from "./scenes/Call Center/addAgent";
import AddProduct from "./scenes/Call Center/addProduct";
import RegisterUser from "./scenes/Registration/registerUser";
import ReportDashboard from "./scenes/Reports/Reportdashboard";
import AdminApproval from "./scenes/Admin/adminApproval";
import QualityApproval from "./scenes/Quality Approval/qualityApproval";
import InventoryApproval from "./scenes/Inventory/inventoryApproval";
import FinanceApproval from "./scenes/Finance/financeApproval";
import CEOApproval from "./scenes/CEO/CEOApproval";
import Login from "./scenes/user/loginPage";
import { io } from "socket.io-client";

function PrivateRoutes() {
  const user = useSelector((state) => state.user);

  if (user && user.token) {
    switch (user.user.role) {
      case "Admin":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/adminApproval" element={<AdminApproval />} />
            <Route path="/addItem" element={<AddItem />} />
            <Route path="/items" element={<Items />} />
            <Route path="/team" element={<Team />} />
            <Route path="/reportdashboard" element={<ReportDashboard />} />
          </Routes>
        );
      case "Call Center":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addItem" element={<AddItem />} />
            <Route path="/items" element={<Items />} />
            <Route path="/addAgent" element={<AddAgent />} />
            <Route path="/addProduct" element={<AddProduct />} />
          </Routes>
        );
      case "Super Admin":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addItem" element={<AddItem />} />
            <Route path="/items" element={<Items />} />
            <Route path="/registeruser" element={<RegisterUser />} />
          </Routes>
        );
      case "Quality Approval":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qualityApproval" element={<QualityApproval />} />
          </Routes>
        );
      case "Inventory":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventoryApproval" element={<InventoryApproval />} />
          </Routes>
        );
      case "Finance":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/financeApproval" element={<FinanceApproval />} />
          </Routes>
        );
      case "Doctor":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ceoApproval" element={<CEOApproval />} />
          </Routes>
        );
      default:
        return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" />;
  }
}

function App() {
  const [theme, colorMode] = useMode();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          dispatch(setUser({ user: parsedUser, token: storedToken }));
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    // Reset notification count when navigating to the agent list
    return navigate((location) => {
      if (location.pathname === "/items") {
        setNotificationCount(0);
      }
    });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {user && user.token ? (
            <>
              <Sidebar
                userRole={user.user.role}
                notificationCount={notificationCount}
              />
              <main className="content">
                <Topbar />
                <PrivateRoutes />
              </main>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
