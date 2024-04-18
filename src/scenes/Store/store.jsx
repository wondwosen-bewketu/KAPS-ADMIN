import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux";
import TextField from '@mui/material/TextField';
import { fetchStoresAsync, selectStores } from "../../redux/slice/storeSlice";

const columns = [
//   { field: 'id', headerName: 'ID', width: 100 },
  { field: 'productName', headerName: 'Product-Name', width: 295 },
  { field: 'location', headerName: 'location', width: 295 },
  { field: 'quantity', headerName: 'quantity', type: 'number', width: 295 },
];

export default function DataTable() {
  const [filterText, setFilterText] = useState('');
  const [rows, setRows] = useState([]);
  const stores = useSelector(selectStores);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStoresAsync());
  }, [dispatch]);

  useEffect(() => {
    setRows(stores);
  }, [stores]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);  
  };

  const filteredRows = rows.filter((row) => {
    const productName = row.productName ? row.productName.toLowerCase() : '';
    const location = row.location ? row.location.toLowerCase() : '';
    return productName.includes(filterText.toLowerCase()) || location.includes(filterText.toLowerCase());
  });

  const getRowId = (row) => row._id; // Define a custom getRowId function

  return (
    <div style={{ height: 400, width: '98%' }}>
      <TextField
        id="search"
        label="Search"
        value={filterText}
        onChange={handleFilterChange}
        variant="outlined"
        style={{ marginBottom: '16px' }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        // pageSize={5}
        
        checkboxSelection
        getRowId={getRowId} // Provide the custom getRowId function
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
      />
    </div>
  );
}
