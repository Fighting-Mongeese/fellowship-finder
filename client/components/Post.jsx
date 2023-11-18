//CHILD OF POSTLIST
import React, { useState, useEffect, useContext } from 'react';
// import NorthIcon from '@mui/icons-material/North';
import { South, North } from '@mui/icons-material';

function Post({
  message, user, upVotes, created, deletePost, id, editPost, inc, dec
}) {
  const [formInput, setFormInput] = useState('');
  let [huzzah, setHuzzah] = useState(upVotes);
  //console.log('post props', id)

  // const inc = () => {

  // };

  return (
    <div className="post">
      <h4 className="post-message">{message}</h4>
      <h5 className="post-user">{user}</h5>
      <div className="post-created">{created}</div>
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
          console.log('formInput', upVotes);
        }}
        />
        <div className="post-upvotes">Huzzahs: {huzzah}</div>
        <South onClick={() => {
          setHuzzah(huzzah -= 1);
          dec(id, huzzah);
          console.log('formInput', upVotes);
        }}
        />
      </div>
    </div>
  );
}

export default Post;
