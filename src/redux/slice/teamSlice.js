// teamSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  blockEmployeeApi,
  unblockEmployeeApi,
  fetchEmployeesApi,
} from "../../api/api";

export const blockEmployee = createAsyncThunk(
  "team/blockEmployee",
  async (employeeId, { getState }) => {
    const response = await blockEmployeeApi(employeeId);

    const updatedEmployees = getState().team.map((employee) =>
      employee.id === employeeId ? { ...employee, blocked: true } : employee
    );

    return updatedEmployees;
  }
);

export const unblockEmployee = createAsyncThunk(
  "team/unblockEmployee",
  async (employeeId, { getState }) => {
    const response = await unblockEmployeeApi(employeeId);

    const updatedEmployees = getState().team.map((employee) =>
      employee.id === employeeId ? { ...employee, blocked: false } : employee
    );

    return updatedEmployees;
  }
);

export const fetchEmployees = createAsyncThunk(
  "team/fetchEmployees",
  async () => {
    return fetchEmployeesApi();
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        console.error("Error fetching employees:", action.error.message);
      })
      .addCase(blockEmployee.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(unblockEmployee.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export const { actions } = teamSlice;
export const selectEmployees = (state) => state.team;

export default teamSlice.reducer;
