import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/baseURL";
import {
  createTheme,
  ThemeProvider,

} from "@mui/material/styles";
import { withStyles } from "@mui/styles";

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
  Typography,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define custom styles for the table
const StyledTableCell = withStyles((theme) => ({
  head: {
  
    color: theme.palette.common.black,
    fontWeight: "bold",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#d32f2f",
    },
  },
});

const GeneralManagerApproval = () => {
  const [products, setProducts] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}approval/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.products);
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
          ? `${BASE_URL}approval/${selectedProductId}/generalManager-approval`
          : `${BASE_URL}approval/${selectedProductId}/generalManager-rejected`;

      const token = localStorage.getItem("token");
      await axios.put(
        endpoint,
        null,
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
                    ? "General Manager Approved"
                    : "General Manager Rejected",
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

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>General Manager Approval</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Admin Approved By</StyledTableCell>
                <StyledTableCell>Finance Approved By</StyledTableCell>
                <StyledTableCell>Auditor Approved By</StyledTableCell>
                <StyledTableCell>General Manager Approved By</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
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
                  <TableCell>
                    {product.adminApproval && product.adminApproval.fullName}
                  </TableCell>
                  <TableCell>
                    {product.financeApproval &&
                      product.financeApproval.fullName}
                  </TableCell>
                  <TableCell>
                    {product.oditorApproval && product.oditorApproval.fullName}
                  </TableCell>
                  <TableCell>
                    {product.generalManagerApproval &&
                      product.generalManagerApproval.fullName}
                  </TableCell>
                  <TableCell>
                    {product.approvalStatus === "Oditor Approved" && (
                      <>
                        {product.approvalStatus ===
                        "General Manager Approved" ? (
                          <CheckCircleOutline sx={{ color: "green" }} />
                        ) : product.approvalStatus ===
                          "General Manager Rejected" ? (
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
          <DialogTitle>
            Confirm {actionType === "approve" ? "Approval" : "Rejection"}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to{" "}
              {actionType === "approve" ? "approve" : "reject"} this product?
            </Typography>
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

export default GeneralManagerApproval;
