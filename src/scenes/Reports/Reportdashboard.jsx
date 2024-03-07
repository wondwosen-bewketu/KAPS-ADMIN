// ReportsDashboard.js
import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from "@material-ui/core";
import LocationBasedReports from "./LocationbasedReport";
import ItemBasedReports from "./ItembasedReport";
import { fetchLocations, fetchItems } from "../../api/api";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  buttonsContainer: {
    marginBottom: theme.spacing(3),
  },
  selectFormControl: {
    minWidth: 200,
  },
  reportsContainer: {
    marginTop: theme.spacing(2),
  },
}));

const ReportsDashboard = () => {
  const classes = useStyles();
  const [selectedView, setSelectedView] = useState("location");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingLocations(true);
      setLoadingItems(true);

      try {
        const locationsData = await fetchLocations();
        setLocations(locationsData);

        const itemsData = await fetchItems();
        setItems(itemsData);
      } finally {
        setLoadingLocations(false);
        setLoadingItems(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className={classes.root}>
      <Typography
        variant="h4"
        align="center"
        className={classes.title}
        gutterBottom
      >
        Reports Dashboard
      </Typography>

      <Grid
        container
        spacing={3}
        justify="center"
        className={classes.buttonsContainer}
      >
        <Grid item>
          <Button
            variant={selectedView === "location" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleViewChange("location")}
          >
            Location Based
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedView === "item" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleViewChange("item")}
          >
            Item Based
          </Button>
        </Grid>
      </Grid>

      {selectedView === "location" && (
        <div>
          <FormControl className={classes.selectFormControl}>
            <InputLabel id="location-select-label">Select Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              {loadingLocations ? (
                <MenuItem value="" disabled>
                  Loading locations...
                </MenuItem>
              ) : (
                locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {selectedLocation && (
            <LocationBasedReports location={selectedLocation} />
          )}
        </div>
      )}

      {selectedView === "item" && (
        <div>
          <FormControl className={classes.selectFormControl}>
            <InputLabel id="item-select-label">Select Items</InputLabel>
            <Select
              labelId="item-select-label"
              id="item-select"
              value={selectedItem}
              onChange={handleItemChange}
            >
              {loadingItems ? (
                <MenuItem value="" disabled>
                  Loading items...
                </MenuItem>
              ) : (
                items.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {selectedItem && <ItemBasedReports item={selectedItem} />}
        </div>
      )}
    </Container>
  );
};

export default ReportsDashboard;
