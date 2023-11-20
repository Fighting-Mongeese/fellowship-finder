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
  //const [uploadEventSelect, setUploadEventSelect] = useState('Select an Event for Your Photo');
  const { activeUser, setActiveUser } = useContext(UserContext);
  const inputFile = useRef(null);
  const defaultOption = useRef(null);

  const onFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
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
        console.log('endp', endpoint, 'param', param.id);
        console.log('selected', selected);
        setUrls(urlObjs.data);
      })
      .catch((err) => console.log('could not get users', err));
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
      console.log('userObj from filter func', user);
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
          console.log('photoUrl:', response.data.secure_url, 'userId:', activeUser.id, 'eventId', eventId);
          axios.post('/upload/photoUrl', { photoUrl: response.data.secure_url, userId: activeUser.id, eventId })
            .then(() => {
              setSuccess(true);
              if (inputFile.current) {
                inputFile.current.value = '';
              }
              setUploadEvent('Select an Event for Your Photo');
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
      {console.log('state', uploadEvent)}
      <h2>Fellowship Photos</h2>
      <h4>Upload photos from your last fellowship meet up!</h4>
      { events ? (
        <form
          encType="multipart/form-data"
        >
          <select
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
      <h4>Filter By:</h4>
      <button
        onClick={() => setFilter('user')}
      >User
      </button>
      <button
        onClick={() => setFilter('event')}
      >Event
      </button>
      {filter ? (
        <div>
          {filter === 'event'
            ? (
              <select
                onChange={(event) => setSelected(['event', event.target.value])}
              >
                <option value="" disabled selected hidden>Select an Event</option>
                {events.map((event) => {
                  console.log(event);
                  return <option key={event.id}>{event.title}</option>;
                }) }
              </select>
            )
            : (
              <select
                onChange={(event) => setSelected(['user', event.target.value])}
              >
                <option value="" disabled selected hidden>Select a User</option>
                {users.map((userObj) => {
                  console.log(userObj);
                  return <option key={userObj.id}>{userObj.username}</option>;
                }) }
              </select>
            )}
          <button
            onClick={() => getFilteredPhotos(selected)}
          >filter
          </button>
        </div>
      ) : <div />}
      {
        header ? (
          <h3>
            {selected[0] === 'event' ? `${selected[1]} Photos` : `${selected[1]}'s Photos`}
          </h3>
        ) : <h3>Your Photos</h3>
      }
      {urls.map((urlObj) => (
        <Photo
          urlObj={urlObj}
          key={urlObj.id}
        />
      ))}
    </div>
  );
};

export default PhotoUpload;
// data.map((event) => {
//   //console.log(event.eventId);
//   return axios.get(`/api/event/${event.eventId}`)
//     .then((eventObj) => {
//       //console.log(eventObj.data);
// /*figure out a way to add to event upload state on each successful get*/
//       //setUplodEvent(() => [...uploadEvent, eventObj.data])
//       // const updateEvents = () => {
//       //   setUserEvents([
//       //     ...userEvents,
//       //     eventObj.data
//       //   ]);
//       // };
//       // updateEvents();
//       //eventsArr.push(eventObj.data);
//       //setUserEvents([...userEvents, eventObj.data]);
//     })
//     //.then(() => setUserEvents(...userEvents, eventsArr))
//     .catch((err) => console.log('could not get eventObj', err));
// });
// .then((usEvtArr) => {
//   console.log(usEvtArr);
//   getEvents(usEvtArr)
//     .then((evtArr) => {
//       console.log('eventsObj array', evtArr);
//       setEvents(evtArr);
//     })
//     .catch((err) => console.log('getevent', err));
//   //   .then((eventsArray) => console.log(eventsArray));
// })
// .catch((err) => console.log('could not get events', err));

// const getEvents = (array) => {
//   //return new Promise((reject, resolve) => {
//   console.log(array[0]);
//   return axios.get(`/api/event/${array[0].eventId}`)
//     .then((eventObj) => {
//       eventsArr.push(eventObj.data);
//       return eventsArr;
//     })
//     .then((arr) => {
//       if (array.length > 1) {
//         getEvents(array.slice(1));
//       }
//       return arr;
//     })
//     .catch((err) => console.error('could not get eventObj', err));
//   //æ});
// };
