import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAsync,
  selectProducts,
} from "../../redux/slice/wearhouseSlice"; 

const ProductList = () => {
const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const { location } = useParams();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("productname");
  const [order, setOrder] = useState("asc");

  
  useEffect(() => {
    dispatch(fetchProductsAsync(location));
  }, [dispatch, location]);

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedProducts = products.slice().sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        <p
          style={{
            margin: "1rem",
            fontSize: "30px",
            fontWeight: "bold",
            color: "#d7a022",
          }}
        >
          Products at {location}
        </p>
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "productname"}
                  direction={orderBy === "productname" ? order : "asc"}
                  onClick={() => handleSortRequest("productname")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "quantity"}
                  direction={orderBy === "quantity" ? order : "asc"}
                  onClick={() => handleSortRequest("quantity")}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "unit"}
                  direction={orderBy === "unit" ? order : "asc"}
                  onClick={() => handleSortRequest("unit")}
                >
                  unit
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "productprice"}
                  direction={orderBy === "productprice" ? order : "asc"}
                  onClick={() => handleSortRequest("productprice")}
                >
                  Price
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product._id}>
                  <TableCell component="th" scope="row">
                    {product.productname}
                  </TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">{product.unit}</TableCell>
                  <TableCell align="right">{product.productprice}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default ProductList;
