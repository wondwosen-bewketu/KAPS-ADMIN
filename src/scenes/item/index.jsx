import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import { fetchItems } from "../../redux/slice/itemSlice";
import { BASE_URL } from "../../api/baseURL";
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

  useEffect(() => {
    dispatch(fetchItems({ page, pageSize }));
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
    if (!item) return null;

    return (
      <img
        src={`${BASE_URL}${item.file}`}
        alt="avatar"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "10%",
          border: "2px solid #333",
          cursor: "pointer",
        }}
        onClick={() => handleImageClick(`${BASE_URL}${item.file}`)}
      />
    );
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
        {items && items.length > 0 ? (
          <DataGrid
            rows={items}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pageSize={pageSize}
            rowsPerPageOptions={[10]}
            checkboxSelection
            getRowId={(row) => row._id}
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
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
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
