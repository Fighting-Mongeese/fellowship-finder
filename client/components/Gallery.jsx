import React, { useState } from 'react';
import axios from 'axios';
import Photo from './Photo.jsx';

const Gallery = (props) => {
  const { user } = props;
  const [urls, setUrls] = useState([]);
  //console.log(user);
  const getUserPhotos = () => {
    axios.get(`upload/photos/${user.id}`)
      .then((urlObjs) => setUrls(urlObjs.data))
      .catch((err) => console.log('could not get users', err));
  };
  getUserPhotos();
  return (
    <div>
      Gallery
      {urls.map((urlObj) => (
        <Photo
          urlObj={urlObj}
          key={urlObj.id}
        />
      ))}
    </div>
  );
};

export default Gallery;
