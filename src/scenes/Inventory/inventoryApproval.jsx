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

const InventoryApproval = () => {
  const [products, setProducts] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [inventoryReferral, setInventoryReferral] = useState(""); // New state for inventory referral input

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}approval/inventoryApproval`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          ? `${BASE_URL}approval/${selectedProductId}/inventory-approval`
          : `${BASE_URL}approval/${selectedProductId}/inventory-rejected`;

      const token = localStorage.getItem("token");
      await axios.put(
        endpoint,
        { inventoryReferral }, // Include inventory referral in the request body
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
                    ? "Inventory Approved"
                    : "Inventory Rejected",
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

  const handleApproveClick = (productId) => {
    setSelectedProductId(productId);
    setActionType("approve");
    setOpenConfirmation(true);
    setInventoryReferral(""); // Clear inventory referral input
  };

  const handleRejectClick = (productId) => {
    setSelectedProductId(productId);
    setActionType("reject");
    setOpenConfirmation(true);
    setInventoryReferral(""); // Clear inventory referral input
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
        <h2>Inventory Approval</h2>
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
                  <TableCell>{product.inventoryApprovalName}</TableCell>{" "}
                  <TableCell>
                    {product.approvalStatus === "Quality Approved" && (
                      <>
                        {product.approvalStatus === "Inventory Approved" ? (
                          <CheckCircleOutline sx={{ color: "green" }} />
                        ) : product.approvalStatus === "Inventory Rejected" ? (
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
              id="inventoryReferral"
              label="Inventory Referral (optional)"
              type="text"
              fullWidth
              value={inventoryReferral}
              onChange={(e) => setInventoryReferral(e.target.value)}
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

export default InventoryApproval;
