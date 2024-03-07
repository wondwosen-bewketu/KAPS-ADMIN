// reducers.js

import { combineReducers } from "redux";
import itemReducer from "./slice/itemSlice";
import teamReducer from "./slice/teamSlice";
import userReducer from "./slice/userSlice"; // Add userReducer
import dashboardReducer from "./slice/dashboardSlice"; // Add userReducer
import productReducer from "./slice/productSlice"; // Add userReducer

const rootReducer = combineReducers({
  user: userReducer, // Add user reducer
  items: itemReducer,
  team: teamReducer,
  dashboard: dashboardReducer,
  products: productReducer,
  // Add other reducers here if needed
});

export default rootReducer;
