import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import Badge from '@mui/material/Badge';
// import Modal from '@mui/material/Modal';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import { Card, CardContent, CardActions, Typography, IconButton, Badge, Modal, Box, Button } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/Delete';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Delete, DeleteForeverIcon } from '@mui/icons-material';
import { Radar } from 'react-chartjs-2';
import { UserContext } from '../components/UserProvider';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler);

export default function CharSheet({ sheet, getSheets }) {
  const { activeUser, setActiveUser } = useContext(UserContext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteChar = () => {
    axios
      .delete(`/sheet/${sheet.id}`)
      .then(getSheets)
      .then(handleClose)
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Card
        style={{ backgroundColor: 'white', margin: 20 }}
        sx={{ width: 500 }}
        className="chart-container"
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 25 }}
            align="center"
            color="black"
          >
            {sheet.charName}
          </Typography>
          <Typography
            sx={{ fontSize: 15 }}
            align="center"
            color="black"
          >
            {`${sheet.charRace} ${sheet.charClass}`}
          </Typography>
          <Radar
            data={{
              labels: ['STR', 'CON', 'CHA', 'INT', 'WIS', 'DEX'],
              datasets: [
                {
                  data: [
                    sheet.str,
                    sheet.con,
                    sheet.cha,
                    sheet.int,
                    sheet.wis,
                    sheet.dex,
                  ],
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              scales: {
                r: {
                  angleLines: {
                    display: false,
                  },
                  suggestedMin: 0,
                  suggestedMax: 20,
                },
              },
            }}
          />
          <Typography
            sx={{ fontSize: 15 }}
            align="center"
            color="black"
          >
            {`Description: ${sheet.charDesc}`}
          </Typography>
          <CardActions style={{ justifyContent: 'center' }}>
            {
              activeUser.id === parseFloat(id)
                ? (
                  <IconButton
                    size="large"
                    color="error"
                    onClick={handleOpen}
                  >
                    <Badge>
                      <DeleteIcon />
                    </Badge>
                  </IconButton>
                )
                : ''
            }
          </CardActions>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            align="center"
            variant="h5"
            style={{ marginBottom: 35 }}
          >
            {`Are you sure you want to delete ${sheet.charName}?`}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={deleteChar}
            style={{ float: 'left' }}
          >
            DELETE
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            style={{ float: 'right' }}
          >
            NEVERMIND
          </Button>
        </Box>
      </Modal>
    </>
  );
}
