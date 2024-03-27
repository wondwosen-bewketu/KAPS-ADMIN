import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider, CircularProgress } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { setUser } from "./redux/slice/userSlice";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import AgentInfoComponent from "./scenes/Call Center/AgentInfoComponet";
import { CartesianAxis } from "recharts";
import { CardTravelRounded } from "@material-ui/icons";
const Settings = React.lazy(() => import("./scenes/user/Settings"));
const Cart = React.lazy(() =>
  import("./scenes/Admin/Cart")
);

// Wrap components with React.lazy
const Dashboard = React.lazy(() => import("./scenes/dashboard"));
const Team = React.lazy(() => import("./scenes/team"));
const Items = React.lazy(() => import("./scenes/item/index"));
const AddItem = React.lazy(() => import("./scenes/item/addItemForm"));
const AddAgent = React.lazy(() => import("./scenes/Call Center/addAgent"));
const AddProduct = React.lazy(() => import("./scenes/Call Center/addProduct"));
const WearHouse = React.lazy(() => import("./scenes/Call Center/wearHouse"));
const ProductList = React.lazy(() =>
  import("./scenes/Call Center/productList")
);
const AgentLogin = React.lazy(() => import("./scenes/Call Center/AgentLogin"));

const RegisterUser = React.lazy(() =>
  import("./scenes/Registration/registerUser")
);
const ReportDashboard = React.lazy(() =>
  import("./scenes/Reports/Reportdashboard")
);
const AdminApproval = React.lazy(() => import("./scenes/Admin/adminApproval"));
const FinanceApproval = React.lazy(() =>
  import("./scenes/Finance Approval/financeApproval")
);
const OditorApproval = React.lazy(() =>
  import("./scenes/Oditor/oditorApproval")
);
const GeneralManagerApproval = React.lazy(() =>
  import("./scenes/General Manager/generalManagerApproval")
);

const Login = React.lazy(() => import("./scenes/user/loginPage"));

function PrivateRoutes() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

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
            <Route path="/setting" element={<Settings />} />
            <Route path="/orders" element={<Cart />} />
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
            <Route path="/agentLogin" element={<AgentLogin />} />
            <Route path="/setting" element={<Settings />} />
            <Route
              path="/wearhouse"
              element={
                <WearHouse
                  onSelectLocation={(location) =>
                    navigate(`/products/${location}`)
                  }
                />
              }
            />

            {/* LocationList component */}
            <Route path="/agentInfo/:phone" element={<AgentInfoComponent />} />
            {/* ProductList component */}
            <Route path="/products/:location" element={<ProductList />} />
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
      case "Finance":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/financeApproval" element={<FinanceApproval />} />
          </Routes>
        );
      case "Oditor":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/oditorApproval" element={<OditorApproval />} />
          </Routes>
        );
      case "General Manager":
        return (
          <Routes>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/generalManagerApproval"
              element={<GeneralManagerApproval />}
            />
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {user && user.token ? (
            <>
              <Sidebar userRole={user.user.role} />
              <main className="content">
                <Topbar />
                {/* Wrap PrivateRoutes with Suspense */}
                <Suspense
                  fallback={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      Loading..
                      <CircularProgress />
                    </div>
                  }
                >
                  <PrivateRoutes />
                </Suspense>
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
