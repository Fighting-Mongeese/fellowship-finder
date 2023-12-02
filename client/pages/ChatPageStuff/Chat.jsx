/* eslint-disable no-undef */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../../components/UserProvider';
//import './Chat.css';
import io from 'socket.io-client'
import axios from 'axios'
const socket = io()

import AuthPage from './AuthPage';
import ChatsPage from './ChatsPage';
import { getActiveElement } from '@mui/x-date-pickers/internals';

function Chat() {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [votes, setVotes] = useState(0)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const { activeUser, setActiveUser } = useContext(UserContext);
  const scrollRef = useRef(null)

  useEffect(() => {
    axios.get(`api/event/user/${user.id}`)
      .then((res) => {
        console.log('vebt', res.data)
        setSelectedRoom(res.data[0])
        
        setRooms(res.data)
        axios.get(`/message/${res.data[0].eventId}`)
          .then(({ data }) => {
            console.log('data', data, selectedRoom)
            setMessages(data)
          })
      })




    socket.on('return message', (newmess) => {
      console.log('new', newmess)
      setMessages((premess) => [...premess, newmess]
      )
      console.log('messi', messages)
    })
    scroll()
  }, [])


  const getEventById = (id) => {
    let result
    axios.get(`/api/event/${id}`)
      .then((res) => {
        result = res.data
      })
    console.log('resss', result)
    return result
  }

  const handleSend = () => {
    console.log('did?', selectedRoom)
    socket.emit('message', { text: message, userId: user.id, chatId: selectedRoom.eventId, votes: votes })
    setMessage('')
  }

  const handleInput = (e) => {
    setMessage(e.target.value)
    console.log('mess', messages)
  }

  const changeRoom = (room) => {
    console.log('e', room)
    setSelectedRoom(room)
    axios.get(`/message/${room.eventId}`)
      .then(({ data }) => {
        console.log('close', data)
        setMessages(data)
      })

  }

  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.height
    }
  }

  return (
    <div>
      {selectedRoom ? <h1>{selectedRoom.title}</h1> : <h1>Chat</h1>}
      {rooms.map((room) => (
        <button onClick={() => changeRoom(room)} key='room.id'>
          {room.title}
        </button>)
      )}


      <div style={{ height: '500px', overflow: 'auto', padding: '10px', overflowAnchor: 'none' }}>
        {messages.map((mess) => (
          <ChatsPage votes={votes} setVotes={setVotes} user={user} message={mess}></ChatsPage>
        ))}
        <div style={{
          overflowAnchor: 'auto',
          height: '1px',
        }}></div>
      </div>
      <div>
        <input value={message} onChange={(e) => { handleInput(e) }}></input>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )

  // if (!user) {
  //   // eslint-disable-next-line no-shadow
  //   return <AuthPage onAuth={(user) => setUser(user)} />;
  // // eslint-disable-next-line no-else-return
  // } else {
  //   return <ChatsPage user={user} />;
  // }
}

export default Chat;
