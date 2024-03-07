import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import Chart from "chart.js/auto";
import "chart.js/auto";
import "tailwindcss/tailwind.css";
import {
  setSelectedFilter,
  setSelectedLocation,
  setSelectedDate,
  setFilteredData,
  setIsLoading,
  setChartType,
  setSelectedItem,
  setIsModalOpen,
  fetchOverallChartDataAsync,
  fetchChartDataAsync,
  fetchDataAndDisplayAllItemsAsync,
  fetchFilterOptionsAsync,
  fetchAllLocationsAsync,
  fetchFilteredDataAsync,
} from "../../redux/slice/dashboardSlice";
import InfoCard from "./InfoCard";
import { makeStyles } from "@mui/styles";

import { BASE_URL } from "../../api/baseURL";

// Constants for action types
const FETCH_FILTERED_DATA_URL = `${BASE_URL}product/filteredData`;

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: "0 0 40%",
    textAlign: "center",
  },
  productImage: {
    maxWidth: "100%",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  infoContainer: {
    flex: "0 0 60%",
    marginLeft: theme.spacing(2),
  },
}));

const theme = createTheme();

const StyledContainer = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartContainer = styled("div")`
  width: 48%;
  position: relative;
`;
const tableHeaderStyle = {
  padding: "0.5rem",
  borderBottom: "2px solid #333",
  background: "#f2f2f2",
  fontWeight: "bold",
};

const tableRowStyle = {
  padding: "0.5rem",
  borderBottom: "1px solid #ccc",
};
const tableCellStyle = {
  padding: "0.5rem",
  textAlign: "center",
};

const TopItemsCard = ({ topItems, onItemClick }) => {
  return (
    <div
      style={{
        width: "48%",
        border: "1px solid #ccc",
        borderRadius: "0.25rem",
        marginBottom: "1rem",
      }}
    >
      <Typography
        variant="h6"
        style={{ textAlign: "center", padding: "0.5rem" }}
      >
        Best Price
      </Typography>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Num</th>
            <th style={tableHeaderStyle}>Item</th>
            <th style={tableHeaderStyle}>Price</th>
            <th style={tableHeaderStyle}>Location</th>
          </tr>
        </thead>
        <tbody>
          {topItems.map((item, index) => (
            <tr key={index} style={tableRowStyle}>
              <td style={tableCellStyle}>{index + 1}</td>

              <td
                style={{ ...tableCellStyle, cursor: "pointer", color: "blue" }}
                onClick={() => onItemClick(item)}
              >
                {item.productname}
              </td>
              <td style={tableCellStyle}>{item.productprice}</td>
              <td style={tableCellStyle}>{item.productlocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Move ItemModal outside Dashboard component
const ItemModal = ({ selectedItem, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      maxHeight="md"
    >
      <DialogTitle>{selectedItem ? selectedItem.productname : ""}</DialogTitle>
      <DialogContent>
        <div className={classes.container}>
          {/* Display image if file exists */}
          {selectedItem && selectedItem.file && (
            <div className={classes.imageContainer}>
              <img
                src={`${BASE_URL}${selectedItem.file}`}
                alt="Product Image"
                className={classes.productImage}
              />
            </div>
          )}

          <div className={classes.infoContainer}>
            <Typography variant="body1">
              <strong>Item:</strong>{" "}
              {selectedItem ? selectedItem.productname : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong>{" "}
              {selectedItem ? selectedItem.productlocation : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Price:</strong>{" "}
              {selectedItem ? selectedItem.productprice : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Quantity:</strong>{" "}
              {selectedItem ? selectedItem.quantity : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong>{" "}
              {selectedItem ? selectedItem.productdescription : ""}
            </Typography>
            <Typography variant="body1">
              <strong>Agent Phone Number:</strong>{" "}
              {selectedItem ? selectedItem.agentphone : ""}
            </Typography>
          </div>
        </div>
        {/* Add more information as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const filterOptions = useSelector((state) => state.dashboard.filterOptions);
  const selectedFilter = useSelector((state) => state.dashboard.selectedFilter);
  const selectedLocation = useSelector(
    (state) => state.dashboard.selectedLocation
  );
  const selectedDate = useSelector((state) => state.dashboard.selectedDate);
  const filteredData = useSelector((state) => state.dashboard.filteredData);
  const prices = useSelector((state) => state.dashboard.prices);
  const locations = useSelector((state) => state.dashboard.locations);
  const isLoading = useSelector((state) => state.dashboard.isLoading);
  const chartData = useSelector((state) => state.dashboard.chartData);
  const chartType = useSelector((state) => state.dashboard.chartType);
  const topItems = useSelector((state) => state.dashboard.topItems);
  const selectedItem = useSelector((state) => state.dashboard.selectedItem);
  const isModalOpen = useSelector((state) => state.dashboard.isModalOpen);
  const [lowestPriceItem, setLowestPriceItem] = useState(null);
  const [bestLocationItem, setBestLocationItem] = useState(null);
  const [latestAddedItem, setLatestAddedItem] = useState(null);
  const [mostExpensiveItem, setMostExpensiveItem] = useState(null);
  const [totalAgents, setTotalAgents] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const chartRef = useRef(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  // Add a check for null or undefined items
  const paginatedItems = filteredData
    ? filteredData.slice(
        (page - 1) * pageSize,
        (page - 1) * pageSize + pageSize
      )
    : [];

  const handleItemClick = (item) => {
    // Set the selected item and open the modal
    dispatch(setSelectedItem(item));
    dispatch(setIsModalOpen(true));
  };

  const fetchOverallChartData = async () => {
    try {
      dispatch(setIsLoading(true));
      await dispatch(fetchOverallChartDataAsync());
    } catch (error) {
      console.error("Failed to fetch overall chart data", error);
      toast.error("Failed to fetch overall chart data. Please try again.");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchOverallChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      dispatch(setIsLoading(true));

      const filterParams = new URLSearchParams();

      if (selectedFilter !== "") {
        filterParams.append("productname", selectedFilter);
      }

      if (selectedLocation !== "") {
        filterParams.append("productlocation", selectedLocation);
      }

      if (selectedDate !== "") {
        filterParams.append("recorddate", selectedDate);
      }

      await dispatch(fetchChartDataAsync(filterParams.toString()));
    } catch (error) {
      console.error("Failed to fetch chart data", error);
      toast.error("Failed to fetch chart data. Please try again.");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const fetchDataAndDisplayAllItems = async () => {
    try {
      await dispatch(fetchDataAndDisplayAllItemsAsync());
    } catch (error) {
      console.error("Failed to fetch all items", error);
      toast.error("Failed to fetch all items. Please try again.");
    }
  };

  useEffect(() => {
    fetchDataAndDisplayAllItems();
  }, []);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        await dispatch(fetchFilterOptionsAsync());
      } catch (error) {
        console.error("Failed to fetch filter options", error);
        toast.error("Failed to fetch filter options. Please try again.");
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        await dispatch(fetchAllLocationsAsync(selectedFilter));
      } catch (error) {
        console.error("Failed to fetch all location options", error);
        toast.error("Failed to fetch all location options. Please try again.");
      }
    };

    fetchAllLocations();
  }, [selectedFilter]);

  useEffect(() => {
    determineChartFetch();
  }, [selectedFilter, selectedLocation, selectedDate]);

  const determineChartFetch = () => {
    if (selectedFilter || selectedLocation || selectedDate) {
      fetchChartData();
    } else {
      fetchOverallChartData();
    }
  };

  const handleFilterChange = (selectedValue) => {
    dispatch(setSelectedFilter(selectedValue));
  };

  const handleLocationChange = (selectedValue) => {
    dispatch(setSelectedLocation(selectedValue));
  };

  const handleDateChange = (selectedValue) => {
    dispatch(setSelectedDate(selectedValue));
  };

  const handleFilterSubmit = async () => {
    try {
      dispatch(setIsLoading(true));

      const filterParams = new URLSearchParams();

      if (selectedFilter !== "") {
        filterParams.append("productname", selectedFilter);
      }

      if (selectedLocation !== "") {
        filterParams.append("productlocation", selectedLocation);
      }

      // Adjust date filter parameters
      if (selectedDate !== "") {
        // Assuming you are using createdAt as the field for date filtering
        filterParams.append("startDate", selectedDate);
        filterParams.append("endDate", selectedDate); // Set endDate to the selected date for an exact match
      }

      const filterUrl = `${FETCH_FILTERED_DATA_URL}?${filterParams.toString()}&prices=${prices.join(
        ","
      )}`;

      await dispatch(fetchFilteredDataAsync(filterUrl));
    } catch (error) {
      console.error("Failed to fetch filtered data", error);
      toast.error("Failed to fetch filtered data. Please try again.");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleChartTypeChange = (event) => {
    dispatch(setChartType(event.target.value));
  };

  const renderChart = () => {
    if (chartRef.current) {
      chartRef.current.data.labels = chartData.labels || [];
      chartRef.current.data.datasets = chartData.datasets || [];
      chartRef.current.config.type = chartType;
      chartRef.current.update();
    } else {
      const ctx = document.getElementById("myChart").getContext("2d");

      chartRef.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels: chartData.labels || [],
          datasets: chartData.datasets || [],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "category",
            },
          },
        },
      });
    }
  };

  useEffect(() => {
    renderChart();
  }, [chartData, chartType]);

  const handleSortModelChange = (model) => {
    const sortedData = [...filteredData];

    if (model.length > 0) {
      const sortModel = model[0];
      const { field, sort } = sortModel;

      let sortLabel;
      let newSortOrder;

      if (field === "price") {
        if (sort === "asc") {
          sortLabel = "Lowest";
          newSortOrder = "desc";
        } else {
          sortLabel = "Highest";
          newSortOrder = "asc";
        }

        toast.info(`Sorting by ${field} in ${sortLabel} order`);
      }

      sortedData.sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];

        if (field === "price") {
          return sort === "asc" ? valueA - valueB : valueB - valueA;
        } else {
          return sort === "asc" ? valueA.localeCompare(valueB) : -1;
        }
      });

      dispatch(setFilteredData(sortedData));
    }
  };

  const renderTable = () => {
    const columns = [
      {
        field: "productname",
        headerName: "Product Name",
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          // Add a click event handler to open the modal on item click
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleItemClick(params.row)}
          >
            {params.value}
          </div>
        ),
      },
      { field: "productprice", headerName: "Price", flex: 1, sortable: true },
      {
        field: "productlocation",
        headerName: "Location",
        flex: 1,
        sortable: true,
      },
      {
        field: "agentphone",
        headerName: "Phone Number",
        flex: 1,
        sortable: true,
      },
    ];

    return (
      <div style={{ flex: 1 }}>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : paginatedItems.length > 0 ? (
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={paginatedItems}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              sortingMode="server"
              onSortModelChange={(model) => handleSortModelChange(model)}
            />
            <Pagination
              count={Math.ceil((filteredData?.length || 0) / pageSize)}
              page={page}
              onChange={(event, newPage) => handlePageChange(newPage)}
              showFirstButton
              showLastButton
              siblingCount={2}
              boundaryCount={2}
              onShowSizeChange={(event, newSize) =>
                handlePageSizeChange(newSize)
              }
            />
          </div>
        ) : (
          <div>No items found.</div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchLowestPriceItem();
    fetchBestLocation();
  }, []); // Removed selectedFilter and selectedDate from dependency array

  const fetchLowestPriceItem = async () => {
    try {
      dispatch(setIsLoading(true));

      // Adjust the URL or API endpoint based on your backend
      const lowestPriceItemUrl = `${BASE_URL}product/lowestPriceItem`;

      const response = await fetch(lowestPriceItemUrl);
      const data = await response.json();

      if (data) {
        setLowestPriceItem(data);
      } else {
        setLowestPriceItem(null);
        toast.info("No items found for the lowest price.");
      }
    } catch (error) {
      console.error("Failed to fetch lowest price item", error);
      toast.error("Failed to fetch lowest price item. Please try again.");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const fetchBestLocation = async () => {
    try {
      dispatch(setIsLoading(true));

      // Adjust the URL or API endpoint based on your backend
      const bestLocationUrl = `${BASE_URL}product/bestLocationItem`;

      const response = await fetch(bestLocationUrl);
      const data = await response.json();

      if (data) {
        setBestLocationItem(data);
      } else {
        setBestLocationItem(null);
        toast.info("No items found for the best location.");
      }
    } catch (error) {
      console.error("Failed to fetch best location item", error);
      toast.error("Failed to fetch best location item. Please try again.");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    const fetchLatestAddedItem = async () => {
      try {
        // Fetch the latest added item from your API endpoint
        const response = await fetch(`${BASE_URL}product/latestAddedItem`);
        const data = await response.json();

        // Set the latest added item in state
        setLatestAddedItem(data);
      } catch (error) {
        console.error("Failed to fetch latest added item", error);
        // Handle error as needed
      }
    };

    const fetchMostExpensiveItem = async () => {
      try {
        // Fetch the most expensive item from your API endpoint
        const response = await fetch(`${BASE_URL}product/mostExpensiveItem`);
        const data = await response.json();

        // Set the most expensive item in state
        setMostExpensiveItem(data);
      } catch (error) {
        console.error("Failed to fetch most expensive item", error);
        // Handle error as needed
      }
    };

    // Call the functions to fetch data
    fetchLatestAddedItem();
    fetchMostExpensiveItem();
  }, []);

  useEffect(() => {
    const fetchTotalAgentsAndItems = async () => {
      try {
        // Fetch total agent count from your API endpoint
        const responseAgents = await fetch(`${BASE_URL}agent/total`);
        const dataAgents = await responseAgents.json();

        // Fetch total item count from your API endpoint
        const responseItems = await fetch(`${BASE_URL}adminitem/total`);
        const dataItems = await responseItems.json();

        // Set the total agent and total item counts in state
        setTotalAgents({ totalAgents: dataAgents.totalAgents });
        setTotalItems({ totalItems: dataItems.totalItems });
      } catch (error) {
        console.error("Failed to fetch total agents and items", error);
        // Handle error as needed
      }
    };

    fetchTotalAgentsAndItems();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="container mx-auto mt-10 p-6 bg-gray-100"
        style={{ marginLeft: "20px" }}
      >
        <h1 className="text-3xl font-bold mb-6">DASHBOARD</h1>
        {/* Info Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          {/* Info Card - Total Agents */}
          <InfoCard title="Total Agents" data={totalAgents} />

          {/* Info Card - Total Items */}
          <InfoCard title="Total Items" data={totalItems} />

          {/* Info Card - Best Location */}
          <InfoCard title="Best Location Item" data={bestLocationItem} />

          {/* Info Card - Most Expensive Item */}
          <InfoCard title="Most Expensive Item" data={mostExpensiveItem} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div style={{ flex: 1, marginRight: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Items
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              style={{
                marginTop: "0.25rem",
                display: "block",
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
              }}
            >
              <option value=""></option>
              {filterOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, marginRight: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Locations
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              style={{
                marginTop: "0.25rem",
                display: "block",
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
              }}
            >
              <option value=""></option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, marginRight: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Date
            </label>
            <input
              type="date"
              style={{
                marginTop: "0.25rem",
                display: "block",
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
              }}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          <button
            style={{
              marginTop: "0.5rem",
              backgroundColor: "#F59E0B",
              color: "#fff",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
            onClick={handleFilterSubmit}
          >
            Apply Filter
          </button>
          <div style={{ flex: 1, marginRight: "1rem" }}>
            <Box mt={2} style={{ textAlign: "center", marginBottom: "1rem" }}>
              <Typography variant="h6">Select Chart Type:</Typography>
              <Select
                value={chartType}
                onChange={handleChartTypeChange}
                displayEmpty
                style={{
                  width: "200px",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #ccc",
                }}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
              </Select>
            </Box>
          </div>
        </div>

        <StyledContainer
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Bar Chart */}
            <ChartContainer
              style={{
                width: "48%",
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
              }}
            >
              <canvas id="myChart" width="400" height="400"></canvas>
            </ChartContainer>
            {/* Top Items Card */}
            <TopItemsCard topItems={topItems} onItemClick={handleItemClick} />
            <div
              style={{
                width: "48%",
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
                overflowX: "auto",
              }}
            >
              {renderTable()}
            </div>
          </div>
        </StyledContainer>
        {isModalOpen && (
          <ItemModal
            selectedItem={selectedItem}
            onClose={() => dispatch(setIsModalOpen(false))}
          />
        )}
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
