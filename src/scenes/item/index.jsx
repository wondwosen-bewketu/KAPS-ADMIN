// Import useState and useEffect
import React, { useState, useEffect } from "react";
import { Box, Modal, CircularProgress, Button } from "@mui/material"; // Import Button component
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import { fetchItems } from "../../redux/slice/itemSlice";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { BASE_URL } from "../../api/baseURL";

const Items = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const totalPages = useSelector((state) => state.items.totalPage); // Add selector for totalPages
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setLoading] = useState(false); // State for loading status
  const [pricingDetails, setPricingDetails] = useState(null); // State to store pricing details

  useEffect(() => {
    setLoading(true); // Set loading state to true when fetching starts
    dispatch(fetchItems({ page, pageSize })).then(() => {
      setLoading(false); // Set loading state to false when fetching finishes
    });
  }, [dispatch, page, pageSize]); // Fetch items whenever page or pageSize changes

  // Add handleFirstPage function
  const handleFirstPage = () => {
    setPage(1);
  };

  // Add handleLastPage function
  const handleLastPage = () => {
    setPage(totalPages);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Increment page number
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handlePriceButtonClick = (productId) => {
    // Fetch pricing details for the selected product
    // You can use fetch or any library like axios to make the API call
    fetch(`${BASE_URL}product/pricing-details/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        // Store pricing details in state and open modal
        setPricingDetails(data);
        setImageModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching pricing details:", error);
        // Handle error if necessary
      });
  };

  function renderImageCell(params) {
    const item = items.find((item) => item.id === params.row.id);
    if (!item) return null;

    return item ? (
      <img
        src={
          item.file && item.file.url ? item.file.url : "default_image_file.jpg"
        }
        alt="avater"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "10%",
          border: "2px solid #333",
          cursor: "pointer", // Add cursor pointer for clickable image
        }}
        onClick={() =>
          handleImageClick(
            item.file && item.file.url ? item.file.url : "default_image_url.jpg"
          )
        }
      />
    ) : null;
  }

  const columns = [
    {
      field: "file",
      headerName: "Image",
      flex: 1,
      renderCell: renderImageCell,
    },
    { field: "productname", headerName: "Product Name", flex: 1 },
    { field: "productprice", headerName: "Price", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "productlocation", headerName: "Location", flex: 1 },
    { field: "agentphone", headerName: "Phone Number", flex: 1 },
    { field: "productdescription", headerName: "Description", flex: 1 },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) =>
        new Date(params.row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handlePriceButtonClick(params.row._id)}
        >
          Price
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px" height="100%">
      <Header title="Items" subtitle="List of Items" />
      <Box m="40px 0 0 0" height="calc(75vh - 64px)">
        {isLoading ? ( // Render loading spinner if isLoading is true
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : items && items.length > 0 ? (
          <DataGrid
            rows={items}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            // pageSize={10}
            rowsPerPageOptions={[10]}
            pageSizeOptions={[10, 25, 50, 100]}
            checkboxSelection
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            autoHeight
          />
        ) : (
          <div>No data available</div>
        )}

<Modal open={isImageModalOpen} onClose={() => setImageModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      borderRadius: 8,
      p: 4,
      outline: "none", // Remove default outline
    }}
  >
    <h2 style={{ marginBottom: 20 }}>Pricing Details</h2>
    {pricingDetails && (
      <div>
       
        <p>Quantity: {pricingDetails.quantity}</p>
        <p>Product Price: {pricingDetails.productprice}</p>
        <p>Item Price: {pricingDetails.itemPrice}</p>
        <p>labor Cost: {pricingDetails.laborCost}</p>
        <p>Delivery Fee: {pricingDetails.deliveryFee}</p>
        <p>fertilizerCost: {pricingDetails.fertilizerCost}</p>
        <p>Total Price: {pricingDetails.totalPrice}</p>
        <p>productNetPrice: {pricingDetails.productNetPrice}</p>
      </div>
    )}
    <Button variant="contained" onClick={() => setImageModalOpen(false)}>Close</Button>
  </Box>
</Modal>

        <Box mt={2} textAlign="center">
          <IconButton onClick={handleFirstPage} disabled={page === 1}>
            <FirstPageIcon />
          </IconButton>
          <IconButton onClick={handlePreviousPage} disabled={page === 1}>
            <NavigateBeforeIcon />
          </IconButton>
          <span>Page {page}</span>
          <IconButton
            onClick={handleNextPage}
            disabled={page === totalPages || totalPages === 0}
          >
            <NavigateNextIcon />
          </IconButton>
          <IconButton
            onClick={handleLastPage}
            disabled={page === totalPages || totalPages === 0}
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Items;
