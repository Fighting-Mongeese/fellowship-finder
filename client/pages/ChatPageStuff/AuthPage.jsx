/* eslint-disable react/destructuring-assignment */

import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../components/UserProvider';

const AuthPage = (props) => {
  const { activeUser, setActiveUser } = useContext(UserContext);
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (activeUser !== null) {
      const { username } = activeUser;

      console.log('use', activeUser)

      axios
        .post('/authenticate', { username })
        .then((r) => {
          console.log('res', r.data)
          const data = { ...r.data, secret: username };
          // eslint-disable-next-line react/prop-types
          props.onAuth(data);
        })
        .catch((err) => console.error('Error: ', err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUser]);

  return (
    <div> ''</div>
  );
};

export default AuthPage;


// import axios from 'axios';


// const AuthPage = (props) => {
//   const onSubmit = (e) => {
//     e.preventDefault();
//     const { value } = e.target[0];

//     axios.post(
//       'http://localhost:3001/authenticate',
//       { username: value }
//     )
//       // eslint-disable-next-line react/destructuring-assignment, react/prop-types
//       .then((r) => props.onAuth({ ...r.data, secret: value }))
//       .catch((err) => console.error('Error: ', err));

//     // eslint-disable-next-line react/destructuring-assignment, react/prop-types
//     props.onAuth({ username: value, secret: value });
//   };

//   return (
//     <div className="background">
//       <form onSubmit={onSubmit} className="form-card">
//         <div className="form-title">Welcome 👋</div>

//         <div className="form-subtitle">Set a username to get started</div>

//         <div className="auth">
//           <div className="auth-label">Username</div>
//           <input className="auth-input" name="username" />
//           <button className="auth-button" type="submit">
//             Enter
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AuthPage;

