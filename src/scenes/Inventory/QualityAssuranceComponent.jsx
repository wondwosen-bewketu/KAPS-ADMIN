import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInventoryProductsAsync } from "../../redux/slice/inventorySlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Modal,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../api/baseURL";

const InventoryList = () => {
  const dispatch = useDispatch();
  const inventoryProducts = useSelector((state) => state.inventory.products);
  const status = useSelector((state) => state.inventory.status);
  const error = useSelector((state) => state.inventory.error);

  useEffect(() => {
    dispatch(fetchInventoryProductsAsync());
  }, [dispatch]);

  const [updatedProducts, setUpdatedProducts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState({});

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}store/GRN/approval-status`
        );
        const { approvalStatus } = response.data;
        setApprovalStatus(approvalStatus);
        localStorage.setItem("approvalStatus", JSON.stringify(approvalStatus));
        console.log("Approval status:", approvalStatus);
      } catch (error) {
        console.error("Error fetching approval status:", error);
      }
    };

    fetchApprovalStatus();
  }, []);

  const handleUpdate = async (productId, netQuantity, remark) => {
    try {
      const response = await axios.put(
        `${BASE_URL}store/GRN/update`,
        {
          productId,
          netQuantity,
          remark,
          approvalStatus: updatedProducts[productId].approvalStatus,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error updating net quantity and remark:", error);
    }
  };

  const handleApprovalStatusUpdate = async (productId, approvalStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}store/GRN/approval-status`,
        {
          productId,
          approvalStatus,
        }
      );
      console.log(response.data);
      setApprovalStatus({
        ...approvalStatus,
        [productId]: approvalStatus,
      });
      localStorage.setItem("approvalStatus", JSON.stringify({
        ...approvalStatus,
        [productId]: approvalStatus,
      }));
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Goods Received Note (GRN) Products</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Expected Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Net Received Quantity</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Approval Status</TableCell>
              <TableCell>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>{product.unitPrice}</TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>{product.orderID}</TableCell>
                <TableCell>{product.netQuantity}</TableCell>
                <TableCell>{product.remark}</TableCell>
                <TableCell>
                  {approvalStatus[product._id]?.toLowerCase() === "Pending" ? (
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleApprovalStatusUpdate(product._id, "Quality Assurance Approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleApprovalStatusUpdate(product._id, "Quality Assurance Rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Typography>{approvalStatus[product._id]}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openModal(product)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 8,
            textAlign: "center",
            p: 4,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Update Product
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            label="Net Quantity"
            fullWidth
            margin="normal"
            value={updatedProducts[selectedProduct?._id]?.netQuantity || ""}
            onChange={(e) =>
              setUpdatedProducts({
                ...updatedProducts,
                [selectedProduct?._id]: {
                  ...updatedProducts[selectedProduct?._id],
                  netQuantity: e.target.value,
                },
              })
            }
          />
          <TextField
            variant="outlined"
            size="small"
            label="Remark"
            fullWidth
            margin="normal"
            value={updatedProducts[selectedProduct?._id]?.remark || ""}
            onChange={(e) =>
              setUpdatedProducts({
                ...updatedProducts,
                [selectedProduct?._id]: {
                  ...updatedProducts[selectedProduct?._id],
                  remark: e.target.value,
                },
              })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              handleUpdate(
                selectedProduct?._id,
                updatedProducts[selectedProduct?._id]?.netQuantity,
                updatedProducts[selectedProduct?._id]?.remark
              )
            }
            sx={{ mt: 2, mr: 2 }}
          >
            Update
          </Button>
          <Button onClick={closeModal} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default InventoryList;
