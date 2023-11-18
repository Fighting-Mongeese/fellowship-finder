import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Badge from '@mui/material/Badge';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
import { AppBar, Box, Toolbar, IconButton, Typography, Badge, Menu, MenuItem } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
// import MapIcon from '@mui/icons-material/Map';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import SignpostIcon from '@mui/icons-material/Signpost';
// import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { 
  AddCircleOutline,
  PhotoLibrary,
  Signpost,
  MoreVert,
  Map,
  TodayTwoTone,
  Mail,
  AccountCircle,
  Search,
} from '@mui/icons-material';

import axios from 'axios';
import { UserContext, UserProvider } from '../components/UserProvider';


function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const { activeUser, setActiveUser } = useContext(UserContext);
  const navigate = useNavigate();
  console.log('active user', activeUser);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    axios.get('http://localhost:3001/auth/logout', {
      withCredentials: true,
    })
      .then(() => {
        setActiveUser(null);
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          background: 'linear-gradient(90deg, rgb(0, 124, 119) 0%, rgb(0, 11, 158) 100%)',
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
              <Search />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new messages"
              color="inherit"
              component={Link}
              to="/chat"
            >
              <Badge>
                <Mail />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="search"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to="/postList"
            >
              <Badge>
                <Signpost />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new messages"
              color="inherit"
              component={Link}
              to="/map"
            >
              <Badge>
                <Map />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new messages"
              color="inherit"
              component={Link}
              to="/photos"
            >
              <Badge>
                <PhotoLibrary />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 1 new events"
              color="inherit"
              component={Link}
              to="/events"
            >
              <Badge>
                <TodayTwoTone />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="search"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to="/addSheet"
            >
              <AddCircleOutline />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to={ activeUser ? `/user/${activeUser.id}` : '/auth/login'}
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  width: '20ch',
                },
              }}
            >
              <MenuItem onClick={handleLogout}>
                LOGOUT
              </MenuItem>
            </Menu>
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
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
