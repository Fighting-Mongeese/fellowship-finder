import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import { TextField, Select, MenuItem, Button, Avatar } from '@mui/material';
import axios from 'axios';
import profilepic from '../assets/profilepic.jpg';

import './Test.css';

function Home() {
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState([]);

  const handleAddFriend = (friendUsername) => {
    fetch(`/api/user/add-friend/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        username: friendUsername
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (response.ok) {
          setResults(results);
        }
      })
      .catch((err) => {
        console.error('Failed to ADD FRIEND to db:', err);
      });
  };

  const handleUnfriend = (enemyUsername) => {
    fetch(`/api/user/unfriend/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        username: enemyUsername
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (response.ok) {
          console.log('Friend removed');
        }
      })
      .catch((err) => {
        console.error('Failed to UNFRIEND in db:', err);
      });
  };

  const getUser = () => {
    axios.get('http://localhost:3001/auth/login/success', {
      withCredentials: true,
    })
      .then((response) => {
        console.log('auth login response', response);
        const { id } = response.data;
        console.log(id);
        setUserId(id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetch('/api/user/all')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((users) => {
        setResults(users);
        getUser();
      })
      .catch((err) => {
        console.error('Failed to FETCH users from db:', err);
      });
  }, []);
  return (
    <main>
      <div className="search-results">
        {results.length ? results.map((user) => (
          user.id === userId ? null : (
            <div key={user.id} className="user-card">
              <div className="avatar-wrapper">
                <Avatar
                  alt="WizardKitty"
                  src={profilepic}
                />
              </div>
              <h3>
                <Link to={`/user/${user.id}`}>{user.username}</Link>
              </h3>
              <div className="user-info">
                <span className="label">Age:</span>
                <span className="value">{user.age}</span>
                <br />
                <span className="label">Sober:</span>
                <span className="value">{user.sober}</span>
                <br />
                <span className="label">Host:</span>
                <span className="value">{user.canHost}</span>
                <br />
                <span className="label">DM:</span>
                <span className="value">{user.DM}</span>
                <br />
                <span className="label">Combat Heaviness:</span>
                <span className="value">{user.combatHeaviness}</span>
                <br />
                <span className="label">Strategy Heaviness:</span>
                <span className="value">{user.strategyHeaviness}</span>
                <br />
                <span className="label">Roleplay Focus:</span>
                <span className="value">{user.roleplayFocus}</span>
                <br />
                <span className="label">Story Focus:</span>
                <span className="value">{user.storyFocus}</span>
              </div>
              {userId !== user.id && (
                <div className="button-wrapper">
                  <Button variant="contained" onClick={() => handleAddFriend(user.username)}>Add Companion</Button>
                  <Button variant="contained" onClick={() => handleUnfriend(user.username)}>Make Enemy</Button>
                </div>
              )}
            </div>
          )
        )) : <div className="no-results">Curses! There are no adventurers to display.</div>}
      </div>
    </main>
  );
}

export default Home;
