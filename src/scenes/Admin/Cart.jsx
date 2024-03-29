import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/baseURL";
import OrderDetails from "./OrderDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const CartList = () => {
  const [carts, setCarts] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}cart/all`);
      setCarts(response.data);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleOrderDetailsClose = () => {
    setSelectedOrderId(null);
  };

  return (
    <div>
      <h2>Cart Information</h2>
      {selectedOrderId && (
        <OrderDetails
          cart={carts.find((cart) => cart.orderID === selectedOrderId)}
          onClose={handleOrderDetailsClose}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carts.map((cart) => (
              <TableRow key={cart.orderID}>
                <TableCell>{cart.orderID}</TableCell>
                <TableCell>{cart.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewDetails(cart.orderID)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CartList;
