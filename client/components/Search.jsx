import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Grid from '@mui/material/Grid';
import { TextField, Select, MenuItem, Button, Avatar, Grid } from '@mui/material';
import axios from 'axios';
import profilepic from '../assets/profilepic.jpg';
import { UserContext } from './UserProvider.jsx';

const Search = () => {
  const { activeUser, setActiveUser } = useContext(UserContext);
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    ageMin: '',
    ageMax: '',
    sober: 'any',
    canHost: 'any',
    DM: 'any',
    combatHeavinessMin: '',
    combatHeavinessMax: '',
    strategyHeavinessMin: '',
    strategyHeavinessMax: '',
    roleplayFocusMin: '',
    roleplayFocusMax: '',
    storyFocusMin: '',
    storyFocusMax: ''
  });

  const getUser = () => {
    axios.get('http://localhost:3001/auth/login/success', {
      withCredentials: true,
    })
      .then((response) => {
        const { id } = response.data;
        setUserId(id);
        setActiveUser(response.data);
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

  const handleSubmit = () => {
    fetch('/api/user/all')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((users) => {
        const filteredUsers = users.filter((user) => {
          const {
            ageMin,
            ageMax,
            sober,
            canHost,
            DM,
            combatHeavinessMin,
            combatHeavinessMax,
            strategyHeavinessMin,
            strategyHeavinessMax,
            roleplayFocusMin,
            roleplayFocusMax,
            storyFocusMin,
            storyFocusMax
          } = filters;

          if (
            (ageMin && user.age < ageMin)
            || (ageMax && user.age > ageMax)
            || (sober !== 'any' && user.sober.toString() !== sober)
            || (canHost !== 'any' && user.canHost.toString() !== canHost)
            || (DM !== 'any' && user.DM !== DM)
            || (combatHeavinessMin && user.combatHeaviness < combatHeavinessMin)
            || (combatHeavinessMax && user.combatHeaviness > combatHeavinessMax)
            || (strategyHeavinessMin && user.strategyHeaviness < strategyHeavinessMin)
            || (strategyHeavinessMax && user.strategyHeaviness > strategyHeavinessMax)
            || (roleplayFocusMin && user.roleplayFocus < roleplayFocusMin)
            || (roleplayFocusMax && user.roleplayFocus > roleplayFocusMax)
            || (storyFocusMin && user.storyFocus < storyFocusMin)
            || (storyFocusMax && user.storyFocus > storyFocusMax)
          ) {
            return false;
          }
          return true;
        });
        setResults(filteredUsers);
      })
      .catch((err) => {
        console.error('Failed to FETCH users from db:', err);
      });
  };

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h1>Search the Realms</h1>
          <div className="search-options">
            <div className="age">
              <h3>Age</h3>
              <TextField
                name="ageMin"
                type="number"
                label="Min"
                value={filters.ageMin}
                onChange={handleFilterChange}
              />
              <TextField
                name="ageMax"
                type="number"
                label="Max"
                value={filters.ageMax}
                onChange={handleFilterChange}
              />
            </div>
            <br />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div className="DM">
                  <h3>DM</h3>
                  <Select
                    name="DM"
                    value={filters.DM}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="maybe">Maybe</MenuItem>
                  </Select>
                </div>
                <br />
              </Grid>
              <Grid item xs={4}>
                <div className="can-host">
                  <h3>Can Host</h3>
                  <Select
                    name="canHost"
                    value={filters.canHost.toString()}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </div>
                <br />
              </Grid>
              <Grid item xs={4}>
                <div className="sober">
                  <h3>Sober</h3>
                  <Select
                    name="sober"
                    value={filters.sober.toString()}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="any">Any</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </div>
              </Grid>
            </Grid>
            <br />
            <div className="game-preferences">
              <h3>Combat Heaviness</h3>
              <TextField
                name="combatHeavinessMin"
                type="number"
                label="Min"
                value={filters.combatHeavinessMin}
                onChange={handleFilterChange}
              />
              <TextField
                name="combatHeavinessMax"
                type="number"
                label="Max"
                value={filters.combatHeavinessMax}
                onChange={handleFilterChange}
              />
              <br />
              <h3>Strategy Heaviness</h3>
              <TextField
                name="strategyHeavinessMin"
                type="number"
                label="Min"
                value={filters.strategyHeavinessMin}
                onChange={handleFilterChange}
              />
              <TextField
                name="strategyHeavinessMax"
                type="number"
                label="Max"
                value={filters.strategyHeavinessMax}
                onChange={handleFilterChange}
              />
              <h3>Roleplay Focus</h3>
              <TextField
                name="roleplayFocusMin"
                type="number"
                label="Min"
                value={filters.roleplayFocusMin}
                onChange={handleFilterChange}
              />
              <TextField
                name="roleplayFocusMax"
                type="number"
                label="Max"
                value={filters.roleplayFocusMax}
                onChange={handleFilterChange}
              />
              <h3>Story Focus</h3>
              <TextField
                name="storyFocusMin"
                type="number"
                label="Min"
                value={filters.storyFocusMin}
                onChange={handleFilterChange}
              />
              <TextField
                name="storyFocusMax"
                type="number"
                label="Max"
                value={filters.storyFocusMax}
                onChange={handleFilterChange}
              />
            </div>
            <br />
            <Button variant="contained" onClick={handleSubmit}>Search</Button>
          </div>
        </Grid>
        <Grid item xs={6}>
          <h1>Adventurers</h1>
          <div className="search-results">
            {results.length ? results.map((user) => (
              user.googleId === userId ? null
                : (
                  <div key={user.id}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        position: 'relative',
                        mr: '225px',
                        mt: '20px',
                      }}
                      alt="WizardKitty"
                      src={profilepic}
                    />
                    <h3>
                      <Link to={`/user/${user.id}`}>{user.username}</Link>
                    </h3>
                    {`${user.age} sober: ${user.sober}, host: ${user.canHost}, DM: ${user.DM}, combatHeaviness: ${user.combatHeaviness}, strategyHeaviness: ${user.strategyHeaviness}, roleplayFocus: ${user.roleplayFocus}, storyFocus: ${user.storyFocus}`}
                    {userId !== user.id && (
                    <>
                      <br />
                      <br />
                      <Button variant="contained" onClick={() => handleAddFriend(user.username)}>Add Companion</Button>
                      <Button variant="contained" onClick={() => handleUnfriend(user.username)}>Make Enemy</Button>
                    </>
                    )}
                  </div>
                )
            ))
              : <div>Curses! There are no adventurers to display.</div> }
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Search;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const Search = () => {
//   const [userId, setUserId] = useState('');
//   const [results, setResults] = useState([]);
//   const [filters, setFilters] = useState({
//     ageMin: '',
//     ageMax: '',
//     sober: 'any',
//     canHost: 'any',
//     DM: 'any',
//     combatHeavinessMin: '',
//     combatHeavinessMax: '',
//     strategyHeavinessMin: '',
//     strategyHeavinessMax: '',
//     roleplayFocusMin: '',
//     roleplayFocusMax: '',
//     storyFocusMin: '',
//     storyFocusMax: ''
//   });

//   const getUser = () => {
//     axios.get('http://localhost:3001/auth/login/success', {
//       withCredentials: true,
//     })
//       .then((response) => {
//         console.log(response.data.googleId);
//         setUserId(response.data.googleId);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   useEffect(() => {
//     fetch('/api/user/all')
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         }
//         throw response;
//       })
//       .then((users) => {
//         setResults(users);
//         getUser();
//       })
//       .catch((err) => {
//         console.error('Failed to FETCH users from db:', err);
//       });
//   }, []);

//   const handleSubmit = () => {
//     fetch('/api/user/all')
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         }
//         throw response;
//       })
//       .then((users) => {
//         const filteredUsers = users.filter((user) => {
//           const {
//             ageMin,
//             ageMax,
//             sober,
//             canHost,
//             DM,
//             combatHeavinessMin,
//             combatHeavinessMax,
//             strategyHeavinessMin,
//             strategyHeavinessMax,
//             roleplayFocusMin,
//             roleplayFocusMax,
//             storyFocusMin,
//             storyFocusMax
//           } = filters;

//           if (
//             (ageMin && user.age < ageMin)
//             || (ageMax && user.age > ageMax)
//             || (sober !== 'any' && user.sober.toString() !== sober)
//             || (canHost !== 'any' && user.canHost.toString() !== canHost)
//             || (DM !== 'any' && user.DM !== DM)
//             || (combatHeavinessMin && user.combatHeaviness < combatHeavinessMin)
//             || (combatHeavinessMax && user.combatHeaviness > combatHeavinessMax)
//             || (strategyHeavinessMin && user.strategyHeaviness < strategyHeavinessMin)
//             || (strategyHeavinessMax && user.strategyHeaviness > strategyHeavinessMax)
//             || (roleplayFocusMin && user.roleplayFocus < roleplayFocusMin)
//             || (roleplayFocusMax && user.roleplayFocus > roleplayFocusMax)
//             || (storyFocusMin && user.storyFocus < storyFocusMin)
//             || (storyFocusMax && user.storyFocus > storyFocusMax)
//           ) {
//             return false;
//           }
//           return true;
//         });
//         setResults(filteredUsers);
//       })
//       .catch((err) => {
//         console.error('Failed to FETCH users from db:', err);
//       });
//   };

//   const handleAddFriend = (friendUsername) => {
//     fetch(`/api/user/add-friend/${userId}`, {
//       method: 'PATCH',
//       body: JSON.stringify({
//         username: friendUsername
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
//       .then((response) => {
//         if (response.ok) {
//           setResults(results);
//         }
//       })
//       .catch((err) => {
//         console.error('Failed to ADD FRIEND to db:', err);
//       });
//   };

//   const handleUnfriend = (enemyUsername) => {
//     fetch(`/api/user/unfriend/${userId}`, {
//       method: 'PATCH',
//       body: JSON.stringify({
//         username: enemyUsername
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })
//       .then((response) => {
//         if (response.ok) {
//           console.log('Friend removed');
//         }
//       })
//       .catch((err) => {
//         console.error('Failed to UNFRIEND in db:', err);
//       });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({ ...filters, [name]: value });
//   };

//   return (
//     <div>
//       <div className="search-options">
//         <div className="age">
//           <h3>Age</h3>
//           <input
//             name="ageMin"
//             type="number"
//             placeholder="min age"
//             value={filters.ageMin}
//             onChange={handleFilterChange}
//           />
//           <input
//             name="ageMax"
//             type="number"
//             placeholder="max age"
//             value={filters.ageMax}
//             onChange={handleFilterChange}
//           />
//         </div>
//         <div className="sober">
//           <h3>Sober</h3>
//           <select
//             name="sober"
//             value={filters.sober.toString()}
//             onChange={handleFilterChange}
//           >
//             <option value="any">Any</option>
//             <option value="false">No</option>
//             <option value="true">Yes</option>
//           </select>
//         </div>
//         <div className="can-host">
//           <h3>Can Host</h3>
//           <select
//             name="canHost"
//             value={filters.canHost.toString()}
//             onChange={handleFilterChange}
//           >
//             <option value="any">Any</option>
//             <option value="false">No</option>
//             <option value="true">Yes</option>
//           </select>
//         </div>
//         <div className="DM">
//           <h3>DM</h3>
//           <select
//             name="DM"
//             value={filters.DM}
//             onChange={handleFilterChange}
//           >
//             <option value="any">Any</option>
//             <option value="no">No</option>
//             <option value="yes">Yes</option>
//             <option value="maybe">Maybe</option>
//           </select>
//         </div>
//         <div className="game-preferences">
//           <h3>Combat Heaviness</h3>
//           <input
//             name="combatHeavinessMin"
//             type="number"
//             placeholder="min combat heaviness"
//             value={filters.combatHeavinessMin}
//             onChange={handleFilterChange}
//           />
//           <input
//             name="combatHeavinessMax"
//             type="number"
//             placeholder="max combat heaviness"
//             value={filters.combatHeavinessMax}
//             onChange={handleFilterChange}
//           />
//           <h3>Strategy Heaviness</h3>
//           <input
//             name="strategyHeavinessMin"
//             type="number"
//             placeholder="min strat heaviness"
//             value={filters.strategyHeavinessMin}
//             onChange={handleFilterChange}
//           />
//           <input
//             name="strategyHeavinessMax"
//             type="number"
//             placeholder="max strategy heaviness"
//             value={filters.strategyHeavinessMax}
//             onChange={handleFilterChange}
//           />
//           <h3>Roleplay Focus</h3>
//           <input
//             name="roleplayFocusMin"
//             type="number"
//             placeholder="min roleplay focus"
//             value={filters.roleplayFocusMin}
//             onChange={handleFilterChange}
//           />
//           <input
//             name="roleplayFocusMax"
//             type="number"
//             placeholder="max roleplay focus"
//             value={filters.roleplayFocusMax}
//             onChange={handleFilterChange}
//           />
//           <h3>Story Focus</h3>
//           <input
//             name="storyFocusMin"
//             type="number"
//             placeholder="min story focus"
//             value={filters.storyFocusMin}
//             onChange={handleFilterChange}
//           />
//           <input
//             name="storyFocusMax"
//             type="number"
//             placeholder="max story focus"
//             value={filters.storyFocusMax}
//             onChange={handleFilterChange}
//           />
//         </div>
//       </div>
//       <button type="submit" onClick={handleSubmit}>Submit</button>
//       {results.length ? results.map((user) => (
//         user.googleId === userId ? null
//           : (
//             <div key={user.id}>
//               <Link to={`/user/${user.id}`}>{user.username}</Link>
//               {`${user.age} sober: ${user.sober}, host: ${user.canHost}, DM: ${user.DM}, combatHeaviness: ${user.combatHeaviness}, strategyHeaviness: ${user.strategyHeaviness}, roleplayFocus: ${user.roleplayFocus}, storyFocus: ${user.storyFocus}`}
//               <button onClick={() => handleAddFriend(user.username)}>Add Companion</button>
//               <button onClick={() => handleUnfriend(user.username)}>Make Enemy</button>
//             </div>
//           )
//       ))
//         : <div>Curses! There are no adventurers to display.</div>}
//     </div>
//   );
// };

// export default Search;
