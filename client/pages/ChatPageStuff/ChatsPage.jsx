/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */

// import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced';

// const ChatsPage = (props) => {
//   const chatProps = useMultiChatLogic(
//     'dee9ce42-872e-458d-aaff-8b5d651583e4',
//     props.user.username,
//     props.user.secret
//   );

//   return (
//     <div style={{ height: '100vh' }}>
//       <MultiChatSocket {...chatProps} />
//       <MultiChatWindow {...chatProps} style={{ height: '100%' }} />
//     </div>
//   );
// };

// export default ChatsPage;


/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */

// import { PrettyChatWindow } from 'react-chat-engine-pretty';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'

const ChatsPage = ({message, user, setVotes, votes}) => {

  const [name, setName] = useState('')
  const [newVotes, setNewVotes] = useState(message.votes)
  // const scrollRef = useRef(null)
  const newDate = new Date(message.createdAt).toLocaleDateString()
  const newTime = new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  

  useEffect(() => {
    axios.get(`/api/user/${message.userId}`)
    .then((user) => {
      setName(user.data.username)
    })
    console.log('newdate', newDate)
    // scroll()
  }) 

  const handleVote = (command) => {
    if(command === 'up'){
      const updatedVotes = {
        votes: newVotes + 1
      }
      axios.put(`/message/${message.id}`, updatedVotes)
      .then((newData) => {
        setNewVotes(newData.data.votes)
      })
    }else{
      const updatedVotes = {
        votes: newVotes - 1
      }
      axios.put(`/message/${message.id}`, updatedVotes)
      .then((newData) => {
        setNewVotes(newData.data.votes)
      })
    }
  }

  // const scroll = () => {
  //   if(scrollRef.current){
  //     scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  //   }
  // }

  return (
    <div style={{padding: '8px', margin: '10px 0', fontSize: '20px', borderRadius: '8px', backgroundColor: '#333333', width: `${Math.min((newTime.length + name.length) * 20, 500)}px` }}>
      
      {message.text} 
      <div style={{fontSize: '10px'}}>{name} {newTime}</div>
      <div>
        <button onClick={() => {handleVote('up')}}>Up</button>
        <div style={{fontSize: '10px'}}>{newVotes}</div>
        <button onClick={() => {handleVote('down')}}>Down</button>
      </div>

    </div>


    // <div style={{ height: '100vh' }}>
    //   <PrettyChatWindow
    //     projectId="7907a3ee-3517-4175-8552-fd7aeeaec4cd"
    //     username={props.user.username}
    //     secret={props.user.secret}
    //     style={{ height: '100%' }}
    //   />
    // </div>
  );
};

export default ChatsPage;

