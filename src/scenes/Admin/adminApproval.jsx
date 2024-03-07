import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import {
  fetchAdminApprovalProducts,
  approveProduct,
  rejectProduct,
} from "../../api/apiApproval";

const AdminApproval = () => {
  const [products, setProducts] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // Track the action type (approve or reject)

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await fetchAdminApprovalProducts();
      setProducts(productsData);
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
          ? approveProduct(selectedProductId)
          : rejectProduct(selectedProductId);

      await endpoint;

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProductId
            ? {
                ...product,
                approvalStatus:
                  actionType === "approve"
                    ? "Admin Approved"
                    : "Admin Rejected",
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
  };

  const handleRejectClick = (productId) => {
    setSelectedProductId(productId);
    setActionType("reject");
    setOpenConfirmation(true);
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
        <h2>Admin Approval</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Agent Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved/Rejected By</TableCell>{" "}
                {/* Added column for admin's full name */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.productname}</TableCell>
                  <TableCell>{product.productprice}</TableCell>
                  <TableCell>{product.productlocation}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.productdescription}</TableCell>
                  <TableCell>{product.agentphone}</TableCell>
                  <TableCell>{product.approvalStatus}</TableCell>
                  <TableCell>{product.adminApprovalName}</TableCell>{" "}
                  {/* Display admin's full name */}
                  <TableCell>
                    {[
                      "Admin Approved",
                      "Quality Approved",
                      "Inventory Approved",
                      "Finance Approved",
                      "CEO Approved",
                    ].includes(product.approvalStatus) ? (
                      <CheckCircleOutline sx={{ color: "green" }} />
                    ) : [
                        "Admin Rejected",
                        "Quality Rejected",
                        "Inventory Rejected",
                        "Finance Rejected",
                        "CEO Rejected",
                      ].includes(product.approvalStatus) ? (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            Are you sure you want to{" "}
            {actionType === "approve" ? "approve" : "reject"} this product?
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

export default AdminApproval;
