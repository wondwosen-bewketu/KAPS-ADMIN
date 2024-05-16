

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
  TablePagination,
  TextField,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import axios for making HTTP requests
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pricingDetails, setPricingDetails] = useState(null); // State to store pricing details
  const [newDeliveryFee, setNewDeliveryFee] = useState(""); // State to store new delivery fee

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

  const handleUpdateDeliveryFee = async () => {
    try {
      setLoading(true);
      // Call the API to update the delivery fee
      const response = await axios.put(`http://localhost:4000/product/update-delivery-fee/${selectedProductId}`, { newDeliveryFee });
      // Update the delivery fee in the pricing details
      setPricingDetails(response.data); // Assuming the response contains the updated pricing details
      toast.success("Delivery fee updated successfully");
      setOpenConfirmation(false);
    } catch (error) {
      console.error("Error updating delivery fee:", error);
      toast.error("Failed to update delivery fee");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      let endpoint;
      if (actionType === "approve") {
        endpoint = await approveProduct(selectedProductId);
      } else if (actionType === "reject") {
        endpoint = await rejectProduct(selectedProductId);
      }
      // Assuming the endpoint returns the updated product status
      const updatedProduct = await endpoint.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProductId
            ? { ...product, approvalStatus: updatedProduct.approvalStatus }
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

  const handlePriceButtonClick = (productId) => {
    // Fetch pricing details for the selected product
    // You can use fetch or any library like axios to make the API call
    fetch(`http://localhost:4000/product/pricing-details/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        // Store pricing details in state and open modal
        setPricingDetails(data);
        setOpenConfirmation(true);
      })
      .catch((error) => {
        console.error("Error fetching pricing details:", error);
        // Handle error if necessary
      });
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the index of the first and last item of the current page
  const indexOfLastProduct = (page + 1) * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h2>Admin Approval</h2>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Agent Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approved/Rejected By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.productname}</TableCell>
                  <TableCell>{product.productprice}</TableCell>
                  <TableCell>{product.productlocation}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.productdescription}</TableCell>
                  <TableCell>{product.agentphone}</TableCell>
                  <TableCell>{product.approvalStatus}</TableCell>
                  <TableCell>{product.adminApprovalName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApproveClick(product._id)}
                      disabled={loading}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRejectClick(product._id)}
                      disabled={loading}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handlePriceButtonClick(product._id)}
                    >
                      Price
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle style={{ backgroundColor: "#1976d2", color: "#fff" }}>
          Price Details
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
          {pricingDetails && (
            <div>
              <p>
                <strong>Tax:</strong> {pricingDetails.tax}
              </p>
              <p>
                <strong>Item Price:</strong> {pricingDetails.itemPrice}
              </p>
              <p>
                <strong>Quantity:</strong> {pricingDetails.quantity}
              </p>
              <p>
                <strong>Product Price:</strong> {pricingDetails.productprice}
              </p>
              <p>
                <strong>Service Charge:</strong> {pricingDetails.serviceCharge}
              </p>
              <TextField
                label="Delivery Fee"
                variant="outlined"
                value={newDeliveryFee}
                onChange={(e) => setNewDeliveryFee(e.target.value)}
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <p>
                <strong>Total Price:</strong> {pricingDetails.totalPrice}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#f5f5f5" }}>
          <Button
            onClick={handleCloseConfirmation}
            style={{ color: "#1976d2" }}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            onClick={handleUpdateDeliveryFee}
            color="primary"
            disabled={loading}
          >
            Update Delivery Fee
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </ThemeProvider>
  );
};

export default AdminApproval;

