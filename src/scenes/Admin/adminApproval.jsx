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
import { BASE_URL } from "../../api/baseURL";

const AdminApproval = () => {
  const [products, setProducts] = useState([]);
  const [openPriceConfirmation, setOpenPriceConfirmation] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // Track the action type (approve or reject)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pricingDetails, setPricingDetails] = useState(null); // State to store pricing details
  const [newDeliveryFee, setNewDeliveryFee] = useState(""); // State to store new delivery fee
  const [adminReferral, setAdminReferral] = useState("");


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
      console.log("Selected Product ID in handleUpdateDeliveryFee:", selectedProductId); // Debugging line
      setLoading(true);
      if (!selectedProductId) {
        throw new Error("Selected product ID is null");
      }
      // Call the API to update the delivery fee
      const response = await axios.put(`${BASE_URL}product/update-delivery-fee/${selectedProductId}`, { newDeliveryFee });
      // Update the delivery fee in the pricing details
      setPricingDetails(response.data); // Assuming the response contains the updated pricing details
      toast.success("Delivery fee updated successfully");
      setOpenPriceConfirmation(false);
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
      const endpoint =
        actionType === "approve"
          ? approveProduct(selectedProductId, adminReferral) // Pass admin referral
          : rejectProduct(selectedProductId, adminReferral); // Pass admin referral
  
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

  const handleClosePriceConfirmation = () => {
    setOpenPriceConfirmation(false);
  };
  
  
  const handleConfirmAction = async () => {
    try {
      setLoading(true);
      let endpoint;
      if (actionType === "approve") {
        endpoint = await approveProduct(selectedProductId);
      } else if (actionType === "reject") {
        endpoint = await rejectProduct(selectedProductId);
      }
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
      setOpenPriceConfirmation(false);
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

  const handlePriceButtonClick = (productId) => {
    console.log("Selected Product ID:", productId); // Debugging line
    setSelectedProductId(productId); // Set selectedProductId when Price button is clicked
    // Fetch pricing details for the selected product
    // You can use fetch or asny library like axios to make the API call
    fetch(`${BASE_URL}product/pricing-details/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        // Store pricing details in state and open modal
        setPricingDetails(data);
        setOpenPriceConfirmation(true);
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
                  <TableCell>
  {product.adminApproval && product.adminApproval.fullName}
</TableCell>


                 
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
                
                    <Button
  variant="outlined"
  color="primary"
  onClick={() => {
    handlePriceButtonClick(product._id);
    setSelectedProductId(product._id); // Set selectedProductId when Price button is clicked
  }}
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

      <Dialog open={openPriceConfirmation} onClose={handleClosePriceConfirmation}>
        <DialogTitle style={{ backgroundColor: "#1976d2", color: "#fff" }}>
          Price Details
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
          {pricingDetails && (
            <div>
             
              <p>
                <strong>Item Price:</strong> {pricingDetails.itemPrice}
              </p>
              <p>
                <strong>Quantity:</strong> {pricingDetails.quantity}
              </p>
              <p>
                <strong>Product Price:</strong> {pricingDetails.productprice}
              </p>
              <p>labor Cost: {pricingDetails.laborCost}</p>
        <p>Delivery Fee: {pricingDetails.deliveryFee}</p>
        <p>Packing Cost: {pricingDetails.fertilizerCost}</p>
        <p>productNetPrice: {pricingDetails.productNetPrice}</p>
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
            onClick={handleClosePriceConfirmation}
            style={{ color: "#1976d2" }}
            disabled={loading}
          >
            Close
          </Button>
          <Button
  onClick={() => handleUpdateDeliveryFee(pricingDetails.productId)} // Pass productId as an argument
  color="primary"
  disabled={loading}
>
  Update Delivery Fee
</Button>

        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    <TextField
      label="Admin Referral"
      variant="outlined"
      value={adminReferral}
      onChange={(e) => setAdminReferral(e.target.value)}
      fullWidth
      style={{ marginBottom: "10px" }}
    />
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
    </ThemeProvider>
  );
};

export default AdminApproval;
