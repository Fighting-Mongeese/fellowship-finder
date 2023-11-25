//CHILD OF POSTLIST
import React, { useState, useEffect, useContext } from 'react';
// import NorthIcon from '@mui/icons-material/North';
import { South, North } from '@mui/icons-material';

function Post({
  message, user, upVotes, created, deletePost, id, editPost, inc, dec, toggle, getAll
}) {
  const [formInput, setFormInput] = useState('');
  let [huzzah, setHuzzah] = useState(upVotes);
  const [postState, setPostState] = useState('');
  const newDate = new Date(created).toLocaleDateString();
  const newTime = new Date(created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
  }, []);
  // const inc = () => {

  // };

  return (
    <div className="post">
      <h2 className="post-message">{message}</h2>
      <h3 className="post-user">-{user}</h3>
      <div className="post-created">Posted on {newDate} at {newTime}</div>
      <div className="key">
        <button
          className="edit-post"
          onClick={() => {
            toggle('field');
            toggle('sub');
            getAll();
          }}
        >Edit
        </button>
        <input
          className="field"
          id="field"
          type="text"
          display="none"
          value={formInput}
          onChange={(e) => setFormInput(e.target.value)}
        />
        <button
          className="edit-submit"
          id="sub"
          onClick={() => {
            editPost(id, formInput);
            toggle('field');
            toggle('sub');
            setFormInput(formInput);
            getAll();
          }}
        >Submit
        </button>
      </div>
      <button className="delete-button" onClick={() => deletePost(id)}>Delete</button>
      <div className="huzzah-container">
        <North onClick={() => {
          setHuzzah(huzzah += 1);
          inc(id, huzzah);
          //getAll();
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
