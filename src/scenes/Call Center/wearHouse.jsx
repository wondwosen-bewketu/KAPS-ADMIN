import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocationsAsync,
  selectWearhouseInfo,
} from "../../redux/slice/wearhouseSlice";

const LocationList = ({ onSelectLocation }) => {
  const dispatch = useDispatch();
  const wearhouseInfo = useSelector(selectWearhouseInfo);

  useEffect(() => {
    dispatch(fetchLocationsAsync());
  }, [dispatch]);

  return (
    <div style={{ margin: "0 auto", padding: "20px" }}>
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        KAPS Warehouse Locations
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "20px",
        }}
      >
        {wearhouseInfo &&
          wearhouseInfo.map((location) => (
            <div
              key={location._id}
              style={{
                backgroundColor: "#d7a022",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                ":hover": { boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)" },
              }}
              onClick={() => onSelectLocation(location.location)}
            >
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
                {location.location}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LocationList;
