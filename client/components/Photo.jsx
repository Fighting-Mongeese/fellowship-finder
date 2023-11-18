import React, { useState } from 'react';
import axios from 'axios';

const Photo = (props) => {
  const { urlObj } = props;
  return (
    <div>
      <img
        style={{ maxHeight: '200px', maxWidth: 'auto' }}
        src={`${urlObj.photoUrl}`}
        alt={`${urlObj.photoUrl}`}
      />
    </div>
  );
};

export default Photo;
