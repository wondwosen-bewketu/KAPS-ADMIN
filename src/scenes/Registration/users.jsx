import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Typography
} from '@mui/material';
import { BASE_URL } from "../../api/baseURL";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
  },
  container: {
    marginTop: '20px',
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
  },
});

const EmployeeList = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}user/all`); // Replace with your backend endpoint
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error if necessary
      }
    };

    fetchUsers();
  }, []);

  return (
    <Paper className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Employee List
      </Typography>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              
              <TableCell className={classes.headerCell}>Name</TableCell>
              <TableCell className={classes.headerCell}>phone Number</TableCell>
              <TableCell className={classes.headerCell}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
               
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EmployeeList;
