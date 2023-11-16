import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useEffect, useState } from 'react';

const EventTable = ({events}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell align="right">Event</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Attendees</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index}
              </TableCell>
              <TableCell align="right">
                {event.title}
              </TableCell>
              <TableCell align="right">{event.street} {event.state}</TableCell>
              <TableCell align="right">{event.start}</TableCell>
              <TableCell align="right">{event.selectedUsers}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default EventTable;
