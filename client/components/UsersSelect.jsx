/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Autocomplete } from '@mui/material';

// UsersSelect Component
const UsersSelect = ({ users, selectedUsers, setSelectedUsers }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const addUser = ({ target }) => {
    console.log(target);
    const user = target.selectedOptions[0].value;
    const updatedSelectedUsers = new Set(selectedUsers);
    updatedSelectedUsers.add(user);
    setSelectedUsers(updatedSelectedUsers);
  };

  const removeUser = (user) => {
    const updatedSelectedUsers = new Set(selectedUsers);
    updatedSelectedUsers.delete(user);
    setSelectedUsers(updatedSelectedUsers);
  };

  return (
    <div style={{
      width: '90%', padding: '8px',
    }}
    >
      <label htmlFor="users-dropdown" style={{ fontSize: '16px', color: '#333' }}>Invites:</label>
      <div>
        <button
          onClick={() => { setDropdownOpen(!isDropdownOpen); }}
          style={{
            background: 'darkgray',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px',
            marginTop: '8px',
            cursor: 'pointer',
          }}
        >
          {isDropdownOpen ? 'Users ▲' : 'Users ▼'}
        </button>
      </div>
      {isDropdownOpen && (
      <div style={{ marginTop: '8px' }}>
        <select
          multiple
          id="users-dropdown"
          value={selectedUsers}
          onChange={addUser}
          style={{
            width: '100%', height: '100px', border: '1px solid #ddd', borderRadius: '4px'
          }}
        >
          {users.map((user) => (
            <option key={user.username} value={user.username} style={{ fontSize: '16px', color: '#333' }}>
              {user.username}<hr />
            </option>
          ))}
        </select>
      </div>
      )}
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {[...selectedUsers].map((selectedUser) => (
          <li
            key={selectedUser}
            style={{
              padding: '8px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            {selectedUser}
            <button
              onClick={() => removeUser(selectedUser)}
              style={{
                background: '#f44336',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>

  );
};

// // MUI VERSION
// const UsersSelect = ({ users, selectedUsers, setSelectedUsers }) => {
//   const handleUsersSelect = (event, value) => {
//     setSelectedUsers(value);
//   };

//   return (
//     <Autocomplete
//       multiple
//       id="users-select"
//       options={users}
//       getOptionLabel={(option) => option.username}
//       onChange={handleUsersSelect}
//       value={selectedUsers}
//       sx={{ width: '90%' }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="standard"
//           label="invites"
//           placeholder="Users"
//         />
//       )}
//     />
//   );
// };

export default UsersSelect;


/*
in the parent component, use these:

const [users, setUsers] = useState([]);
const [selectedUsers, setSelectedUsers] = useState(null);

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

<UsersSelect users={users} selectedUsers={selectedUsers} selectedUsers={setSelectedUsers} />
*/
