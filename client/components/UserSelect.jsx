import React, { useState } from 'react';
//import Autocomplete from '@mui/material/Autocomplete';
import {TextField, Autocomplete} from '@mui/material';

// UserSelect Component
const UserSelect = ({ users, selectedUser, setSelectedUser }) => {
  const handleUserSelect = (event, value) => {
    setSelectedUser(value);
  };

  return (
    <Autocomplete
      id="user-select"
      options={users}
      getOptionLabel={(option) => option.username}
      onChange={handleUserSelect}
      value={selectedUser}
      //renderInput={(params) => <TextField {params} label="user" />}
    />
  );
};

export default UserSelect;


/*
in the parent component, use these:

const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('api/user/all');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users data: ', err);
    }
  };
  fetchUsers();
}, []);

<UserSelect users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
*/
