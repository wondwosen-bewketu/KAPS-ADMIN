import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocationsAsync,
  selectWearhouseInfo,
} from "../../redux/slice/wearhouseSlice";
import { styled } from "@mui/system";
import {Button, Badge} from "@mui/material";
import {socket} from "../global/Sidebar"
import {
  fetchProductsAsync,
  selectProducts,
} from "../../redux/slice/wearhouseSlice"; 


const StyledButton = styled(Button)({
  marginTop: "20px",
  marginRight: "10px",
  background: "linear-gradient(45deg, #d7a022, #60a018)",
  color: "white",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #60a018, #d7a022)",
  },
});

const LocationList = ({ onSelectLocation }) => {
  const dispatch = useDispatch();
  const wearhouseInfo = useSelector(selectWearhouseInfo);     
  const { location } = useParams();
  const products = useSelector(selectProducts);
  const [datasEachwarehouse, setDatasEachwarehouse] = useState([]);
  const [isNewDataEachwarehouse, setIsNewDataEachwarehouse] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  useEffect(() => {
    dispatch(fetchLocationsAsync());
    dispatch(fetchProductsAsync());
  }, [dispatch, location]);

  useEffect(() => {
    socket.emit("initial_Eachwarehouse_data");
    socket.on("get_Eachwarehouse_data", getDataEachwarehouse);
    socket.on("change_Eachwarehouse_data", changeDataEachwarehouse);
    return () => {
      socket.off("get_Eachwarehouse_data");
      socket.off("change_Eachwarehouse_data");
    };
  }, []);

  const getDataEachwarehouse = (datasEachwarehouse) => {
    if (datasEachwarehouse.length && datasEachwarehouse.some((data) => data.read === false)) {
      setIsNewDataEachwarehouse(true);
    } else {
      setIsNewDataEachwarehouse(false);
    }
    setDatasEachwarehouse(datasEachwarehouse);
  };

  const changeDataEachwarehouse = () => socket.emit("initial_Eachwarehouse_data");

  const handleItemClick = (location) => {
    onSelectLocation(location); 

  };

  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wearhouseInfo && wearhouseInfo.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsLength = currentItems?.length;

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div style={{ margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        KAPS Warehouse Locations
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
        {currentItems &&
          currentItems.map((location) => (
            <div
              key={location._id}
              onClick={() => handleItemClick(location.location)} // Add item click handler
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#d7a022",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                ":hover": { boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)" },
              }}
            >
              <p style={{ fontSize: "17px", fontWeight: "bold", margin: "0" }}>{location.location}</p>
              {/* Display notification counter */}
             
            </div>
          ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <StyledButton variant="contained" onClick={prevPage} disabled={currentPage === 1} >
          Previous
        </StyledButton>
        <StyledButton variant="contained" onClick={nextPage} disabled={currentItemsLength < itemsPerPage} >
          Next
        </StyledButton>
      </div>
    </div>
  );
};

export default LocationList;
