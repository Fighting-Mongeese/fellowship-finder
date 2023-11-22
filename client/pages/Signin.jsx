import { UserContext } from '../components/UserProvider';
import { useState, useContext } from 'react';
import {useNavigate} from  'react-router-dom'
import axios from 'axios';
//import GoogleOAuth from '../components/GoogleOAuth';


function Signin() {
  const navigate = useNavigate()
  const { activeUser, setActiveUser } = useContext(UserContext);
  const [signinUsername, setSigninUsername] = useState('');
  const [signinPassword, setSigninPassword] = useState('');


  const signin = () => {
    axios({
      method: 'post',
      data: {
        username: signinUsername,
        password: signinPassword
      },
      withCredentials: true,
      url: '/signin'
    }).then((res) => {
      console.log('actee', res)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setActiveUser(res.data.user)
      navigate(`/home`)
    }).catch((err) => console.error(err));
  };


  return (
    <div>
      <h1>Signin</h1>
      <input
        type="text"
        name="username"
        placeholder="username"
        onChange={(e) => setSigninUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={(e) => setSigninPassword(e.target.value)}
      />
      <button onClick={signin}>Signin</button>
    </div>
  );
}

export default Signin;
