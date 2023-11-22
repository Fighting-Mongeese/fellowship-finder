/* eslint-disable max-len */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import { UserContext } from '../components/UserProvider';

//CHILD OF APP, PARENT OF POST

function PostList() {
  const [allPosts, setAllPosts] = useState([]);
  //const [user, setUser] = useState([]);
  const { activeUser, setActiveUser } = useContext(UserContext);
  const [newPost, setNewPost] = useState([]);
  const [txt, setTxt] = useState([]);
  const [huzzah, setHuzzah] = useState([]);

  const displayMsg = (event) => {
    event.preventDefault();
    setNewPost(txt);
    setTxt('');
  };

  const getAllPosts = () => {
    axios.get('/post/all')
      .then((postArray) => {
        //console.log('postArray', postArray);
        setAllPosts(postArray.data);
      })
      .catch((err) => {
        console.error('Failed to get posts to render', err);
      });
  };

  const newPosting = () => {
    axios.post('/post/add', {
      userId: activeUser.id,
      post: newPost,
      upVotes: 0
    })
      .then(() => {
        getAllPosts();
      })
      .catch((err) => {
        console.error('Failed to newPosting', err);
      });
  };

  const editPost = (id, edit) => {
    axios.patch(`/post/${id}`, {
      edit: {
        post: edit
      }
    })
      .then(() => {
        getAllPosts();
      })
      .catch((err) => {
        console.error('Failed to edit', err);
      });
  };

  const deletePost = (id) => {
    axios.delete(`/post/${id}`)
      .then(() => {
        //console.log('Post Deleted');
        getAllPosts();
      })
      .catch((err) => {
        console.error('Failed to delete', err);
      });
  };

  const inc = (id, edit) => {
    axios.patch(`/post/${id}`, {
      edit: {
        upVotes: edit
      }
    })
      .then((data) => {
        //console.log('AAAAAAAAA upvote data', data)
        getAllPosts();
      })
      .catch((err) => {
        console.error('Failed to up vote', err);
      });
  };

  const dec = (id, edit) => {
    axios.patch(`/post/${id}`, {
      edit: {
        upVotes: edit
      }
    })
      .then(() => {
        getAllPosts();
      })
      .catch((err) => {
        console.error('Failed to down vote', err);
      });
  };


  const toggle = (ID) => {
    const element = document.getElementById(ID);
    if (element.style.display === 'none') {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
    getAllPosts();
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  //TODO: add enter button functionality Clear input field on submit

  //const {post} = allPosts[0];
  // console.log('active user', activeUser);
  // console.log('allPosts', allPosts);
  return (
    <div className="postlist-container">
      <div className="postlist">
        <h3 className="post-header">Post your Requests</h3>
        <input
          type="text"
          name="username"
          placeholder="What's on your mind?"
          value={newPost}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              newPosting();
              setNewPost('');
            }
          }}
          onChange={(e) => setNewPost(e.target.value)}
        />

        <button onClick={() => {
          newPosting();
          setNewPost('');
        }}
        >Submit
        </button>
        <div>
          {allPosts.map((post) => (
            <Post
              message={post.post}
              key={post.id}
              id={post.id}
              user={post.User.username}
              upVotes={post.upVotes}
              created={post.createdAt}
              deletePost={deletePost}
              editPost={editPost}
              inc={inc}
              dec={dec}
              toggle={toggle}
            />

          ))}
        </div>
      </div>
    </div>
  );
}

export default PostList;


