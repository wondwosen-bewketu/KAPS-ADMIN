import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/baseURL";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField, // Import TextField for input field
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FinanceApproval = () => {
  const [products, setProducts] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [financeReferral, setFinanceReferral] = useState(""); // New state for inventory referral input

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}approval/financeApproval`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.products);
      console.log("Products");
      console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      const endpoint =
        actionType === "approve"
          ? `${BASE_URL}approval/${selectedProductId}/finance-approval`
          : `${BASE_URL}approval/${selectedProductId}/finance-rejected`;

      const token = localStorage.getItem("token");
      await axios.put(
        endpoint,
        { financeReferral }, // Include Finance referral in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProductId
            ? {
                ...product,
                approvalStatus:
                  actionType === "approve"
                    ? "Finance Approved"
                    : "Finance Rejected",
              }
            : product
        )
      );
      toast.success(
        `Product ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully`
      );
      setOpenConfirmation(false);
    } catch (error) {
      console.error(
        `Error ${
          actionType === "approve" ? "approving" : "rejecting"
        } product:`,
        error.response.data.message
      );
      toast.error(error.response.data.message || "Failed to perform action");
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}payment/initiate/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Payment initiated successfully");
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (productId) => {
    setSelectedProductId(productId);
    setActionType("approve");
    setOpenConfirmation(true);
    setFinanceReferral(""); // Clear Finance referral input
  };

  const handleRejectClick = (productId) => {
    setSelectedProductId(productId);
    setActionType("reject");
    setOpenConfirmation(true);
    setFinanceReferral(""); // Clear Finance referral input
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2", // Updated primary color
      },
      secondary: {
        main: "#d32f2f", // Updated secondary color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Finance Approval</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved/Rejected By</TableCell>{" "}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.productname}</TableCell>
                  <TableCell>{product.productprice}</TableCell>
                  <TableCell>{product.productlocation}</TableCell>
                  <TableCell>{product.productdescription}</TableCell>
                  <TableCell>{product.approvalStatus}</TableCell>
                  <TableCell>{product.financeApprovalName}</TableCell>{" "}
                  <TableCell>
                    {product.approvalStatus === "Inventory Approved" && (
                      <>
                        {product.approvalStatus === "Finance Approved" ? (
                          <CheckCircleOutline sx={{ color: "green" }} />
                        ) : product.approvalStatus === "Finance Rejected" ? (
                          <CancelOutlined sx={{ color: "red" }} />
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleApproveClick(product._id)}
                              disabled={loading}
                            >
                              {loading && selectedProductId === product._id ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleRejectClick(product._id)}
                              disabled={loading}
                            >
                              {loading && selectedProductId === product._id ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                          </>
                        )}
                      </>
                    )}
                    {product.approvalStatus === "CEO Approved" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleInitiatePayment(product._id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Initiate Payment"
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="financeReferral"
              label="Finance Referral (optional)"
              type="text"
              fullWidth
              value={financeReferral}
              onChange={(e) => setFinanceReferral(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmation}
              color="secondary"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              color={actionType === "approve" ? "primary" : "secondary"}
              autoFocus
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : actionType === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar
        />
      </div>
    </ThemeProvider>
  );
};

export default FinanceApproval;
