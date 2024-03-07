import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  Button,
  Pagination,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header";
import {
  fetchEmployees,
  selectEmployees,
  blockEmployee,
  unblockEmployee,
} from "../../redux/slice/teamSlice";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { BASE_URL } from "../../api/baseURL";

const Team = () => {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toggledEmployees, setToggledEmployees] = useState(() => {
    const storedState = localStorage.getItem("toggledEmployees");
    return storedState
      ? JSON.parse(storedState)
      : Object.fromEntries(
          employees.map((employee) => [employee.id, employee.blocked])
        );
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [actionType, setActionType] = useState(""); // "block" or "unblock"
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  // Add a check for null or undefined items
  const paginatedAgents = employees
    ? employees.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    : [];

  useEffect(() => {
    localStorage.setItem("toggledEmployees", JSON.stringify(toggledEmployees));
  }, [toggledEmployees]);

  const handleToggleChange = (employeeId, isApproved) => {
    setSelectedEmployeeId(employeeId);
    setActionType(isApproved ? "reject" : "approve");
    setConfirmationMessage(
      `Are you sure you want to ${
        isApproved ? "reject" : "approve"
      } this agent?`
    );
    setConfirmationOpen(true);
  };

  const handleConfirmationYes = () => {
    setToggledEmployees({
      ...toggledEmployees,
      [selectedEmployeeId]: !toggledEmployees[selectedEmployeeId],
    });

    // Dispatch block/unblock action based on actionType
    if (actionType === "reject") {
      dispatch(blockEmployee(selectedEmployeeId)).then(() => {
        setSelectedEmployeeId(null);
        setConfirmationOpen(false);
      });
    } else if (actionType === "approve") {
      dispatch(unblockEmployee(selectedEmployeeId)).then(() => {
        setSelectedEmployeeId(null);
        setConfirmationOpen(false);
      });
    }
  };

  const handleConfirmationNo = () => {
    setSelectedEmployeeId(null);
    setConfirmationOpen(false);
  };

  const getToggleIcon = (employeeId) => {
    return toggledEmployees[employeeId] ? (
      <CheckCircleOutlineOutlinedIcon style={{ color: "green" }} />
    ) : (
      <BlockOutlinedIcon style={{ color: "red" }} />
    );
  };
  const columns = [
    {
      field: "img",
      headerName: "Image",
      flex: 1,
      renderCell: renderImgCell,
    },
    { field: "name", headerName: "Full Name", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "files",
      headerName: "Verification File",
      flex: 1,
      renderCell: renderImageCell,
    },
    {
      field: "blocked",
      headerName: "Activate",
      flex: 1,
      renderCell: ({ row }) => (
        <IconButton
          onClick={() => handleToggleChange(row.id, toggledEmployees[row.id])}
        >
          {getToggleIcon(row.id)}
        </IconButton>
      ),
    },
  ];

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  function renderImageCell(params) {
    const employee = employees.find((emp) => emp.id === params.row.id);
    console.log("Employee:", employee);

    return employee && employee.files ? (
      <a
        href={`${BASE_URL}${employee.files}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open PDF
      </a>
    ) : null;
  }

  function renderImgCell(params) {
    const employee = employees.find((emp) => emp.id === params.row.id);
    console.log("Employee:", employee);

    return employee ? (
      <img
        src={`${BASE_URL}${employee.img}`}
        alt="avater"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "10%",
          border: "2px solid #333",
          cursor: "pointer", // Add cursor pointer for clickable image
        }}
        onClick={() => handleImageClick(`${BASE_URL}${employee.img}`)}
      />
    ) : null;
  }

  return (
    <Box m="20px">
      <Header title="Employees" subtitle="List of Employees" />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid
          rows={paginatedAgents}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={pageSize}
          rowsPerPageOptions={[10]}
          checkboxSelection
          getRowId={(row) => row.id}
        />
        <Pagination
          count={Math.ceil((employees?.length || 0) / pageSize)}
          page={page}
          onChange={(event, newPage) => handlePageChange(newPage)}
          showFirstButton
          showLastButton
          siblingCount={2}
          boundaryCount={2}
          onShowSizeChange={(event, newSize) => handlePageSizeChange(newSize)}
        />
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
                alt="avater"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        </Modal>

        <Modal open={isConfirmationOpen}>
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
            <Typography variant="h6" mb={2}>
              {confirmationMessage}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                sx={{ backgroundColor: "orange", color: "white" }}
                onClick={handleConfirmationYes}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "gray", color: "white" }}
                onClick={handleConfirmationNo}
              >
                No
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Team;
