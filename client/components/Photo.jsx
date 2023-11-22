import React from 'react';
import dayjs from 'dayjs';

const Photo = (props) => {
  const { urlObj } = props;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      //justifyContent: 'center',
      alignItems: 'center',
      padding: '5px'
    }}
    >

      <img
        style={{ width: 'auto', height: '200px', objectFit: 'scale-down' }}
        src={`${urlObj.photoUrl}`}
        alt={`${urlObj.photoUrl}`}
      />
      {
        urlObj.User
          ? <p style={{ margin: '1px' }}>Uploaded by <span style={{ fontWeight: 'bold', color: 'green' }}>{urlObj.User.username}</span></p>
          : <p style={{ margin: '1px' }}>Taken at <span style={{ fontWeight: 'bold', color: 'green' }}>{urlObj.Event.title}</span></p>
      }
      <p style={{ marginTop: '1px', marginBottom: '10px' }}>{dayjs(urlObj.createdAt).format('LLLL')}</p>
    </div>

  );
};

export default Photo;
