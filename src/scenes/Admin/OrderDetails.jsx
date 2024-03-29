import React from "react";
import Modal from "@mui/material/Modal";
import { Box, Typography, Divider, Grid } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const OrderDetails = ({ cart, onClose }) => {
  const calculateTotal = (orders) => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
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
          bgcolor: "#f9f9f9",
          borderRadius: 16,
          p: 4,
          fontFamily: "Arial, sans-serif",
          color: "#333",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)",
          },
        }}
      >
        <Box textAlign="center">
          <ShoppingCartIcon sx={{ fontSize: 64, color: "#d7a022" }} />
          <Typography variant="h4" mt={2}>
            Order Details
          </Typography>
        </Box>
        <Divider />
        <Box mt={4}>
          {cart &&
            cart.orders.map((order, index) => (
              <Grid container key={index} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Product Name:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {order.productName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Quantity:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {order.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Unit Price:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${order.price.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Item Price:
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${order.itemPrice.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
        </Box>
        <Divider />
        <Box
          mt={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <MonetizationOnIcon sx={{ fontSize: 64, color: "#60a018" }} />
            <Typography variant="h4" mt={2}>
              Total
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="subtitle1" fontWeight="bold">
              Total Price:
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="#60a018">
              ${cart && calculateTotal(cart.orders).toFixed(2)}
            </Typography>
            {cart.status}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderDetails;
