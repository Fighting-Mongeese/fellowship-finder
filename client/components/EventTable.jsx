// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React from 'react';
import dayjs from 'dayjs';


const EventTable = ({ events, flyToCoordinates }) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'black'}}>
      <TableContainer sx= {{ float: 'right', width: '45vw', margin: '40px', maxHeight: '500px' }}>
        <Table stickyHeader sx={{backgroundColor: '#020b97'}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#020b97" }}>Index</TableCell>
              <TableCell align="right" sx={{ backgroundColor: "#020b97" }}>Event</TableCell>
              <TableCell align="right" sx={{ backgroundColor: "#020b97" }}>Address or Link</TableCell>
              <TableCell align="right" sx={{ backgroundColor: "#020b97" }}>Date</TableCell>
              <TableCell align="right" sx={{ backgroundColor: "#020b97" }}>Guest List</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event, index) => (
              <TableRow
                key={index}
                onClick={() => flyToCoordinates(event.long, event.lat)}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">
                  {event.title}
                </TableCell>
                <TableCell align="right">{event.street} {event.state} {event.link}</TableCell>
                <TableCell align="right">{dayjs(event.start).format('ddd, MMM D, h:mm a')}</TableCell>
                <TableCell align="right">{event.selectedUsers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default EventTable;
