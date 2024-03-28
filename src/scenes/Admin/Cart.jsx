import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/baseURL";
import OrderDetails from "./OrderDetails"; // Import the child component
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CartList = () => {
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);

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

  const handleOrderClick = async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}cart/details/${orderId}`);
      setSelectedCart(response.data);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  return (
    <div>
      <h2>Cart Information</h2>
      {selectedCart ? (
        <OrderDetails cart={selectedCart} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Item Price</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Service Charge</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carts.map((cart) => (
                <React.Fragment key={cart._id}>
                  {cart.orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{cart.orderID}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.unit}</TableCell>
                      <TableCell>{order.price}</TableCell>
                      <TableCell>{order.itemPrice}</TableCell>
                      <TableCell>{order.tax}</TableCell>
                      <TableCell>{order.serviceCharge}</TableCell>
                      <TableCell>{order.totalPrice}</TableCell>
                      <TableCell>{cart.status}</TableCell>
                      <TableCell>
                        <button onClick={() => handleOrderClick(cart.orderID)}>
                          View Details
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CartList;
