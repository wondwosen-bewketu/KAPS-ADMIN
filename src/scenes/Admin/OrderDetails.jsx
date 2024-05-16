import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PrintIcon from "@mui/icons-material/Print";

const OrderDetails = ({ cart, onClose }) => {
  const calculateTotal = (orders) => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={Boolean(cart)}
      onClose={onClose}
      aria-labelledby="order-details-modal"
      aria-describedby="order-details-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 800,
          bgcolor: "#f5f5f5",
          borderRadius: 16,
          p: 4,
          overflowY: "auto",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 48, color: "#d7a022" }} />
            <Typography variant="h4" sx={{ ml: 2 }}>
              Order Details
            </Typography>
            <IconButton onClick={handlePrint} sx={{ ml: "auto" }}>
              <PrintIcon />
            </IconButton>
          </Box>
          <Divider />
          {cart &&
            cart.orders.map((order, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Product Name: {order.productName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Quantity: {order.quantity}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Unit Price: {order.price.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Sub Total: {order.itemPrice.toFixed(2)}
                </Typography>
              </Box>
            ))}
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 48, color: "#60a018" }} />
            <Typography variant="h4" sx={{ ml: 2 }}>
              Total
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            {cart &&
              cart.orders.map((order, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Tax: {order.tax.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Service Charge: {order.serviceCharge.toFixed(2)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Total Price: {order.totalPrice.toFixed(2)}
                  </Typography>
                  Status: {cart.status}
                </Box>
              ))}
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Total: {cart && calculateTotal(cart.orders).toFixed(2)} Birr
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderDetails;
