// AddItemForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  fetchAdminItems,
  updateItem,
  selectItems,
} from "../../redux/slice/itemSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";

const AddItemForm = () => {
  const dispatch = useDispatch();
  const [itemname, setItemName] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [editItemId, setEditItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page according to your preference

  const items = useSelector(selectItems) || []; // Add a default empty array if items is null or undefined

  const isLoading = useSelector((state) =>
    state.items ? state.items.loading ?? false : false
  );

  const error = useSelector((state) =>
    state.items ? state.items.error : null
  );

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminItems());
  }, [dispatch]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!itemname.trim()) {
      toast.error("Item name cannot be empty");
      return;
    }
  
    // Check if the item with the same name already exists
    const isItemAlreadyExists = items.some((item) => item.itemname === itemname);
  
    if (isItemAlreadyExists) {
      toast.error("Item with the same name already exists");
      return;
    }
  
    const newItemData = {
      itemname,
    };
  
    try {
      await dispatch(addItem(newItemData));
      toast.success("Item added successfully!");
      setItemName("");
      dispatch(fetchAdminItems());
  
      // After adding the item, unshift it to the beginning of the items array
      dispatch((state) => {
        state.items.data.unshift(newItemData);
      });
    } catch (error) {
      toast.error("Failed to add item");
    }
  };
  

  const handleEditItemClick = (itemId) => {
    const currentItem = items.find((item) => item.id === itemId);
    if (currentItem) {
      setEditItemId(itemId);
      setEditItemName(currentItem.itemname);
      setEditModalOpen(true);
    }
  };

  const handleEditModalClose = () => {
    setEditItemId(null);
    setEditItemName("");
    setEditModalOpen(false);
  };

  const handleEditModalSave = async () => {
    try {
      // Check if the edited item name already exists
      const isItemNameTaken = items.some(
        (item) => item.itemname === editItemName && item.id !== editItemId
      );

      if (isItemNameTaken) {
        toast.error("Item name already exists");
        return;
      }

      // Proceed with the update
      await dispatch(updateItem({ id: editItemId, itemname: editItemName }));
      toast.success("Item edited successfully!");
      handleEditModalClose();
      dispatch(fetchAdminItems());
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const columns = [
    { field: "itemname", headerName: "Item Name", flex: 1 },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          style={{ color: "orange" }} // or use the sx prop: sx={{ color: "orange" }}
          onClick={() => handleEditItemClick(params.row.id)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ marginLeft: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Add New Items</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <form onSubmit={handleFormSubmit}>
              <TextField
                label="Name"
                variant="outlined"
                value={itemname}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                disableElevation
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? "Adding..." : "Add Item"}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <h2 style={{ marginBottom: 16 }}>Item List</h2>
            {error ? (
              <div>Error loading items: {error.message}</div>
            ) : (
              <>
                <DataGrid
                  rows={currentItems}
                  columns={columns}
                  components={{ Toolbar: GridToolbar }}
                  pageSize={itemsPerPage}
                  rowsPerPageOptions={[]}
                  pagination
                />
                <Box mt={2} display="flex" justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>
                  <Box mx={1}>{`Page ${currentPage}`}</Box>
                  <Button
                    variant="outlined"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === Math.ceil(items.length / itemsPerPage)
                    }
                  >
                    Next
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="New Item Name"
            variant="outlined"
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
          <Button
            onClick={handleEditModalSave}
            variant="contained"
            disableElevation
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default AddItemForm;
