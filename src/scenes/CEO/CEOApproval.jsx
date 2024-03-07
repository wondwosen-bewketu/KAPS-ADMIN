import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/baseURL";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CEOApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}approval/CEOApproval`, {
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

  const handleApproveClick = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}approval/${productId}/ceo-approval`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update product status locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, approvalStatus: "CEO Approved" }
            : product
        )
      );
      toast.success("Product approved by CEO");
    } catch (error) {
      console.error("Error approving product by CEO:", error);
      toast.error("Failed to approve product");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}approval/${productId}/ceo-rejected`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update product status locally
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, approvalStatus: "Finance Approved" }
            : product
        )
      );
      toast.success("Product rejected by CEO");
    } catch (error) {
      console.error("Error rejecting product by CEO:", error);
      toast.error("Failed to reject product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>CEO Approval</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
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
                <TableCell>
                  {product.approvalStatus === "Finance Approved" && (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApproveClick(product._id)}
                        disabled={loading}
                      >
                        {loading ? (
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
                        {loading ? (
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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
};

export default CEOApproval;
