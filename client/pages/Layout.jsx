import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';

function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          background: 'linear-gradient(90deg, hsla(177, 87%, 79%, 1) 0%, hsla(235, 89%, 70%, 1) 100%)',
          width: '100vw',
          height: '20vh',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          position: 'static',
          border: 0,
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          color: 'white',
          padding: '0 30px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home"
            // eslint-disable-next-line object-curly-newline
            sx={{ display: { xs: 'none', sm: 'block', textDecoration: 'none', color: 'inherit' } }}
          >
            𝓕𝓮𝓵𝓵𝓸𝔀𝓼𝓱𝓲𝓹 𝓕𝓲𝓷𝓭𝓮𝓻
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="search"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to="/search"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new messages"
              color="inherit"
              component={Link}
              to="/chat"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 1 new events"
              color="inherit"
              component={Link}
              to="/events"
            >
              <Badge badgeContent={1} color="error">
                <TodayTwoToneIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to="/user/2"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// eslint-disable-next-line react/prop-types
function Layout({ children }) {
  return (
    <div>
      {Header()}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
