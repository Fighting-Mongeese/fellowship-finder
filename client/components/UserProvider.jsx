// /* eslint-disable react/prop-types */
// /* eslint-disable react/jsx-no-constructed-context-values */
// import React, { createContext, useState } from 'react';

// const UserContext = createContext();

// function UserProvider({ children }) {
//   const [user, setUser] = useState(2);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export default UserProvider;

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
//import Layout from '../pages/Layout.jsx';
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUser = () => {
    axios.get('http://localhost:3001/auth/login/success', {
      withCredentials: true,
    })
      .then((response) => {
        const { data } = response;
        localStorage.setItem('user', JSON.stringify(data));
        setActiveUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // console.log('ayy', JSON.parse(localStorage.getItem('user')));
    // console.log(activeUser);
    if (JSON.parse(localStorage.getItem('user'))) {
      setActiveUser(JSON.parse(localStorage.getItem('user')));
      setLoading(false);
    } else {
      getUser();
   }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
