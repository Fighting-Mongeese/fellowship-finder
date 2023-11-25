// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { Box, Table, TableSortLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import dayjs from 'dayjs';


const EventTable = ({ events, flyToCoordinates }) => {
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
  // with exampleArray.slice().sort(exampleComparator)
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      title: 'id',
      backgroundColor: "#161941",
    },
    {
      title: 'Event',
      backgroundColor: "#161941",
    },
    {
      title: 'Address/Link',
      backgroundColor: "#161941",
    },
    {
      title: 'start',
      backgroundColor: "#161941",
    },
    {
      title: 'Players',
      backgroundColor: "#161941",
    },

  ]

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Index');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const visibleRows = React.useMemo(
    () => stableSort(events, getComparator(order, orderBy)),
    [order, orderBy, events, getComparator],
  );

  console.log('here', visibleRows, orderBy, order);
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'black' }}>
      <TableContainer sx={{ float: 'right', width: '45vw', margin: '55px', maxHeight: '500px' }}>
        <Table stickyHeader sx={{ backgroundColor: '#020b97' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headCells.map((cell, index) => {
                return (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{ backgroundColor: cell.backgroundColor }}
                  >
                    {(cell.title === 'id' || cell.title === 'start') && (
                      <TableSortLabel
                        active={orderBy === cell.title}
                        direction={orderBy === cell.title ? order : 'asc'}
                        onClick={createSortHandler(cell.title)}>

                        {cell.title.toUpperCase()}
                        {orderBy === cell.title ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    )}
                    {(cell.title !== 'id' && cell.title !== 'start') && (
                      <p style={{ marginTop: '0px', marginBottom: '0px' }}>
                        {cell.title.toUpperCase()}
                      </p>
                    )}

                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((event, index) => (
              <TableRow
                key={index}
                onClick={() => flyToCoordinates(event.long, event.lat)}
                style={{ backgroundColor: new Date(event.start) > new Date() ? '#357977' : '#020B98' }}
              >
                <TableCell component="th" scope="row">
                  {event.id}
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
