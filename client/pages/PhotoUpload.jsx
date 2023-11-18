import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PhotoUpload = (props) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [uploadEvent, setUploadEvent] = useState(null);
  //const [userEventId, setUserEventId] = useState(null);
  const [events, setEvents] = useState([]);
  //{ id: 1, title: 'my event1' },
  //{ id: 2, title: 'fellowship friends' }, { id: 3, title: 'another test' }
  const eventsArr = [];
  let userEventsArr;
  //const [userEvents, setUserEvents] = useState([]);
  const [success, setSuccess] = useState(false);
  const onFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const getEvents = (array) => {
    //return new Promise((reject, resolve) => {
    console.log(array[0]);
    return axios.get(`/api/event/${array[0].eventId}`)
      .then((eventObj) => {
        eventsArr.push(eventObj.data);
        return eventsArr;
      })
      .then((arr) => {
        if (array.length > 1) {
          getEvents(array.slice(1));
        }
        return arr;
      })
      .catch((err) => console.error('could not get eventObj', err));
    //æ});
  };
  const onFileUpload = () => {
    const data = new FormData();
    data.append('uploaded_file', uploadedFile);

    axios.post('/upload', data)
      .then((response) => {
        const uploadUserEventId = events.filter((event) => event.title === uploadEvent)
          .map((event) => event.id);
        axios.post('/upload/photoUrl', { photoUrl: response.data.secure_url, userEventsId: uploadUserEventId[0] })
          .then(() => setSuccess(true))
          .then(() => setTimeout(() => setSuccess(false), 5000))
          .catch((err) => console.error('could not post to db', err));
        //console.log('cloudinary SUCCESS', response.data);
        // const userEvent = userEvents.filter((userEvt) => userEvt.eventId === uploadEvent.id);
        // console.log('user events', userEvents);
        // console.log('upload event', uploadEvent);
        // console.log('uploade user event id', uploadUserEventId);
      })
      .catch((err) => console.error('could not post to cloud', err));
  };

  const getUserEvents = () => {
    console.log(user);
    axios.get(`/api/event/user/${user.id}`)
      .then(({ data }) => {
        userEventsArr = data;
        return userEventsArr;
      })
      .then((usEvtArr) => {
        console.log(usEvtArr);
        getEvents(usEvtArr)
          .then((evtArr) => {
            console.log('eventsObj array', evtArr);
            setEvents(evtArr);
          })
          .catch((err) => console.log('getevent', err));
        //   .then((eventsArray) => console.log(eventsArray));
      })
      .catch((err) => console.log('could not get events', err));
  };


  //getUserEvents();
  useEffect(() => {
    //if (userEvents !== currUserEvents.current) {
    getUserEvents();
    //currUserEvents.current = userEvents;
    //}
  }, []);
  return (
    <div>
      {/* {console.log('state', userEvents)} */}
      <h2>Fellowship Photos</h2>
      <h4>Upload photos from your last fellowship meet up!</h4>
      { events ? (
        <form
          encType="multipart/form-data"
        >
          <select
            required
            onChange={(event) => setUploadEvent(event.target.value)}
          >
            <option>Select an Event for Your Photo</option>
            {console.log(events)}
            {events.map((event) => {
              console.log(event);
              return <option key={event.id}>{event.title}</option>;
            }) }
          </select>
          <input
            type="file"
            name="uploaded_file"
            onChange={(e) => onFileChange(e)}
          />
          <button
            type="button"
            onClick={() => onFileUpload()}
          >Upload Photo
          </button>
        </form>
      ) : <div />}

      {success ? <h4>Your photo has been uploaded</h4> : <h4> </h4> }

      <h2>See all photos from your attended fellowship events!</h2>
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
