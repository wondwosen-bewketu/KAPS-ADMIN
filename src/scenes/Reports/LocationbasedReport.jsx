import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
} from "@mui/material";

import PrintIcon from "@material-ui/icons/Print";
// import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import {
  fetchLocationReportsAsync,
  fetchLocationSummaryAsync,
} from "../../redux/slice/productSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: "#f5f5f5", // Light gray background
    borderRadius: 10,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle box shadow
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  table: {
    minWidth: 650,
    borderRadius: 8,
    overflow: "hidden",
  },
  pdfLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  printButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: 8,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: theme.spacing(2),
  },
  card: {
    minWidth: 200,
    maxWidth: 300,
    textAlign: "center",
    borderRadius: 8,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
}));

const LocationBasedReports = ({ location }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Use Redux selectors to get the state from the store
  const selectedReport = useSelector((state) => state.products.selectedReport);
  const reportData = useSelector((state) => state.products.reportData);
  const summeryData = useSelector((state) => state.products.summeryData);
  const loading = useSelector((state) => state.products.status === "loading");

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleReportChange = (reportType) => {
    // Dispatch the Redux action to fetch location reports and summary
    dispatch(
      fetchLocationReportsAsync({ location, selectedReport: reportType })
    );
    dispatch(
      fetchLocationSummaryAsync({ location, selectedReport: reportType })
    );
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    dispatch(fetchLocationReportsAsync({ location, selectedReport }));
    dispatch(fetchLocationSummaryAsync({ location, selectedReport }));
  }, [dispatch, location, selectedReport]);

  
  const renderSummaryCards = () => {
    return (
      <div className={classes.cardContainer}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6">Total Items</Typography>
            <Typography variant="h4">{summeryData.totalItems}</Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6">Most Supplied Item</Typography>
            <Typography variant="h5">
              {summeryData.mostSuppliedItem
                ? summeryData.mostSuppliedItem._id
                : "N/A"}
            </Typography>
            <Typography variant="body2">
              Quantity:{" "}
              {summeryData.mostSuppliedItem
                ? summeryData.mostSuppliedItem.totalQuantity
                : 0}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.buttonContainer}>
        <Typography variant="h5" align="center" gutterBottom>
          Location: {location}
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classes.printButton}
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </div>
      </div>

      <FormControl className={classes.formControl}>
        <InputLabel id="report-select-label">Select Report</InputLabel>
        <Select
          labelId="report-select-label"
          id="report-select"
          value={selectedReport}
          onChange={(event) => handleReportChange(event.target.value)}
        >
          <MenuItem value="daily">Daily Report</MenuItem>
          <MenuItem value="weekly">Weekly Report</MenuItem>
          <MenuItem value="monthly">Monthly Report</MenuItem>
          <MenuItem value="annual">Annual Report</MenuItem>
        </Select>
      </FormControl>

      <div ref={componentRef}>
        {loading ? (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Display the selected report based on the logic */}
            <Typography variant="body1">
              Displaying {selectedReport} report for {location}.
            </Typography>
            {/* Display summary cards */}
            {renderSummaryCards()}
            {/* Display report data in a table */}
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Product Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Location</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Price</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reportData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report) => (
                      <TableRow key={report._id}>
                        <TableCell>
                          <Typography variant="body1">
                            {report.productname}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {report.productlocation}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">
                            {report.productprice}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={reportData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={(event, newPage) => setPage(newPage)}
                onChangeRowsPerPage={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 5));
                  setPage(0);
                }}
              />
            </TableContainer>
          </>
        )}
      </div>
    </Paper>
  );
};

export default LocationBasedReports;
