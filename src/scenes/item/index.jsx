import { useEffect, useState } from "react";
import { Box, Modal, CircularProgress } from "@mui/material"; // Import CircularProgress for loading spinner
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import { fetchItems } from "../../redux/slice/itemSlice";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Items = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const totalPages = useSelector((state) => state.items.totalPage); // Add selector for totalPages
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setLoading] = useState(false); // State for loading status

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

  function renderImageCell(params) {
    const item = items.find((item) => item.id === params.row.id);
    console.log(item)
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
            pageSizeOptions={[10,25,50,100]}
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
              bgcolor: "white",
              boxShadow: 24,
              borderRadius: 8,
              p: 4,
            }}
          >
            {selectedImage && (
              <img
                src={selectedImage}
                alt="avatar"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh", // Set maximum height to prevent the image from becoming too large
                  objectFit: "contain",
                  marginBottom: "10px", // Optional: Add margin between images
                }}
              />
            )}
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
