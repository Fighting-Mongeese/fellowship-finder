//CHILD OF POSTLIST
import React, { useState, useEffect, useContext } from 'react';
// import NorthIcon from '@mui/icons-material/North';
import { South, North } from '@mui/icons-material';

function Post({
  message, user, upVotes, created, deletePost, id, editPost, inc, dec
}) {
  const [formInput, setFormInput] = useState('');
  let [huzzah, setHuzzah] = useState(upVotes);
  const newDate = new Date(created).toLocaleDateString();
  const newTime = new Date(created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


  // const inc = () => {

  // };

  return (
    <div className="post">
      <h2 className="post-message">{message}</h2>
      <h3 className="post-user">-{user}</h3>
      <div className="post-created">Posted on {newDate} at {newTime}</div>
      <div className="edit-post" onClick={() => editPost(id, formInput)}>Edit</div>
      <input
        type="text"
        value={formInput}
        onChange={(e) => setFormInput(e.target.value)}
      />
      <div className="delete-button" onClick={() => deletePost(id)}>Delete</div>
      <div className="huzzah-container">
        <North onClick={() => {
          setHuzzah(huzzah += 1);
          inc(id, huzzah);
        }}
        />
        <div className="post-upvotes">Huzzahs: {huzzah}</div>
        <South onClick={() => {
          setHuzzah(huzzah -= 1);
          dec(id, huzzah);
        }}
        />
      </div>
    </div>
  );
}

export default Post;
