import { useEffect, useRef } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  makeStyles,
  Button,
  Card,
  CardContent,
} from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItemReportsAsync,
  fetchItemSummaryAsync,
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

const ItemBasedReports = ({ item }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const selectedReport = useSelector((state) => state.products.selectedReport);
  const reportData = useSelector((state) => state.products.reportData);
  const summeryData = useSelector((state) => state.products.summeryData);
  const loading = useSelector((state) => state.products.status === "loading");

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleReportChange = (reportType) => {
    // Dispatch the action to update the selected report in the Redux store
    dispatch(fetchItemReportsAsync({ item, selectedReport: reportType }));
    dispatch(fetchItemSummaryAsync({ item, selectedReport: reportType }));
  };

  useEffect(() => {
    // Dispatch the action to fetch item reports when item or selected report changes
    dispatch(fetchItemReportsAsync({ item, selectedReport }));

    // Dispatch the action to fetch item summary when item or selected report changes
    dispatch(fetchItemSummaryAsync({ item, selectedReport }));
  }, [item, selectedReport]);

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
          Item: {item}
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
              Displaying {selectedReport} report for {item}.
            </Typography>
            {/* Display summary cards */}
            {renderSummaryCards()}
            {/* Display report data in a table */}
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>{report.productname}</TableCell>
                      <TableCell>{report.productlocation}</TableCell>
                      <TableCell>{report.productprice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>
    </Paper>
  );
};

export default ItemBasedReports;
