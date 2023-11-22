import React, {
  useState, useEffect, useContext, useRef
} from 'react';
import axios from 'axios';
import { UserContext } from '../components/UserProvider.jsx';
import Photo from '../components/Photo.jsx';

const PhotoUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadEvent, setUploadEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState(null);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [header, setHeader] = useState(null);
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  //const [uploadEventSelect, setUploadEventSelect] = useState('Select an Event for Your Photo');
  const { activeUser, setActiveUser } = useContext(UserContext);
  const inputFile = useRef(null);
  const defaultOption = useRef(null);

  const onFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const getUserEvents = (user) => {
    axios.get(`/api/event/user/${user.id}`)
      .then(({ data }) => {
        setEvents(data);
      })
      .catch((err) => console.error('ugh', err));
  };

  const getPhotos = (endpoint, param) => {
    axios.get(`upload/photos/${endpoint}/${param}`)
      .then((urlObjs) => {
        //console.log('endp', endpoint, 'param', param.id);
        //console.log('selected', selected);
        setUrls(urlObjs.data);
      })
      .catch((err) => console.error('could not get users', err));
  };

  const getAllUsers = () => {
    axios.get('/api/user/all')
      .then(({ data }) => {
        const usersArr = data.filter((userObj) => userObj.username !== activeUser.username);
        setUsers(usersArr);
      })
      .catch((err) => console.error('could not get users', err));
  };

  const getFilteredPhotos = (filterArr) => {
    if (filterArr[0] === 'event') {
      const event = events.filter((evt) => evt.title === filterArr[1]);
      getPhotos('event', event[0].eventId);
      setHeader(event);
    } else if (filterArr[0] === 'user') {
      const user = users.filter((usr) => usr.username === filterArr[1]);
      //console.log('userObj from filter func', user);
      getPhotos('user', user[0].id);
      setHeader(user);
    }
  };

  const onFileUpload = () => {
    const data = new FormData();
    data.append('uploaded_file', uploadedFile);
    // console.log('uploading', events);
    if (!uploadEvent || uploadEvent === 'Select an Event for Your Photo') {
      setError('Please input an event before uploading your photos');
    } else {
      if (error) { setError(null); }
      const eventId = events.filter(
        (event) => event.title === uploadEvent
      ).map((evt) => evt.eventId);
      axios.post('/upload', data)
        .then((response) => {
          axios.post('/upload/photoUrl', { photoUrl: response.data.secure_url, userId: activeUser.id, eventId })
            .then(() => {
              setSuccess(true);
              if (inputFile.current) {
                inputFile.current.value = '';
              }
              setUploadEvent('Select an Event for Your Photo');
              setPreview(null);
            })
            .then(() => getPhotos('user', activeUser.id))
            .then(() => setTimeout(() => setSuccess(false), 5000))
            .catch((err) => console.error('could not post to db', err));
        })
        .catch((err) => console.error('could not post to cloud', err));
    }
  };
  useEffect(() => {
    getUserEvents(activeUser);
    getPhotos('user', activeUser.id);
    getAllUsers();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Fellowship Photos</h1>
      <h4 style={{ marginLeft: '15px' }}>Upload a photo from your last fellowship meet up!</h4>
      { events ? (
        <form
          encType="multipart/form-data"
        >
          <select
            style={{ marginLeft: '15px', marginRight: '55px' }}
            required
            value={uploadEvent}
            onChange={(event) => setUploadEvent(event.target.value)}
          >
            <option>
              Select an Event for Your Photo
            </option>
            {events.map((event) => {
              //console.log(event);
              return <option key={event.id}>{event.title}</option>;
            }) }
          </select>
          <input
            type="file"
            ref={inputFile}
            name="uploaded_file"
            onChange={(e) => onFileChange(e)}
          />
          <button
            type="button"
            onClick={() => onFileUpload()}
          >Upload Photo
          </button>
        </form>
      ) : <div>You don't belong to any events! Add an event to the calendar to add a photo.</div>}

      {success ? <h4>Your photo has been uploaded</h4> : <h4> </h4> }
      {error ? <p>{error}</p> : <p />}
      {preview
        ? (
          <div>
            <h4>Preview</h4>
            <img
              alt={uploadedFile.title}
              src={preview}
              style={{ width: 'auto', height: '200px', objectFit: 'scale-down' }}
            />
          </div>
        )
        : <div />}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
      >
        <h4 style={{ marginLeft: '15px' }}>See Photos By:</h4>
        <button
          style={{ marginLeft: '5px' }}
          onClick={() => setFilter('user')}
        >User
        </button>
        <button
          style={{ marginLeft: '5px' }}
          onClick={() => setFilter('event')}
        >Event
        </button>
      </div>
      {filter ? (
        <div>
          {filter === 'event'
            ? (
              <select
                style={{ marginLeft: '15px' }}
                onChange={(event) => setSelected(['event', event.target.value])}
              >
                <option>Select an Event</option>
                {events.map((event) => {
                  //console.log(event);
                  return <option key={event.id}>{event.title}</option>;
                }) }
              </select>
            )
            : (
              <select
                style={{ marginLeft: '15px' }}
                onChange={(event) => setSelected(['user', event.target.value])}
              >
                <option>Select a User</option>
                {users.map((userObj) => {
                  //console.log(userObj);
                  return <option key={userObj.id}>{userObj.username}</option>;
                }) }
              </select>
            )}
          <button
            style={{ marginLeft: '15px' }}
            onClick={() => getFilteredPhotos(selected)}
          >filter
          </button>
        </div>
      ) : <div />}
      {
        header ? (
          <h3 style={{ textAlign: 'center' }}>
            {selected[0] === 'event' ? `${selected[1]} Photos` : `${selected[1]}'s Photos`}
          </h3>
        ) : <h3 style={{ textAlign: 'center' }}>Your Photos</h3>
      }
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}
      >
        {urls.map((urlObj) => (
          <Photo
            urlObj={urlObj}
            key={urlObj.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoUpload;
