import React, { useState, useEffect, useContext } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import axios from 'axios';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CollectionsBookmarkOutlined } from '@mui/icons-material';
import EventDialog from '../components/EventDialog';
import EventForm from '../components/EventForm';
import { UserContext } from '../components/UserProvider';

const localizer = dayjsLocalizer(dayjs);

// const styles={
// };

function Events() {
  const { activeUser, setActiveUser } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const initialEventState = {
    title: '',
    start: dayjs(),
    end: dayjs(),
    isInPerson: false,
    isOnline: false,
    street: '',
    city: '',
    state: '',
    zip: '',
    link: '',
    description: '',
    selectedUsers: [],
  };
  const [event, setEvent] = useState(initialEventState);

  const setEventValue = (key, value) => {
    console.log('keyv', key, value, event)
    setEvent((prevEvent) => ({ ...prevEvent, [key]: value }));
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('api/user/all');
      setUsers(data);
      console.log('retrieved users from server', data);
    } catch (err) {
      console.error('Error fetching users data: ', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('api/event/all');
      // eslint-disable-next-line no-shadow
      console.log('last', data)
      const dates = data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        selectedUsers: event.selectedUsers.includes('$') ?  event.selectedUsers.split(',$, ') : [event.selectedUsers]
      }));
      setEvents(dates);
      console.log('retrieved dates from server', dates);
    } catch (err) {
      console.error('Error fetching events data: ', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const handleSubmit = async () => {
    const newEvent = {
      ...event,
      title: event.title,
      //CHANGE IF THERES TIME TO BE BASED ON LOGGED IN USER
      hostId: activeUser.id,
      selectedUsers: [...event.selectedUsers].join(',$, ')
    };
    try {
      console.log('evuse', newEvent)
      await axios.post('api/event', newEvent);
      console.log('posted event to server', newEvent);
      setEvent(initialEventState);
      fetchEvents();
      const { data } = await axios.get('api/event/all');

      const nwEv = await axios.get(`api/event/${data[data.length - 1].id}`);

      nwEv['userId'] = activeUser.id

      console.log('newvee', nwEv)

      
        const selected = nwEv.data.selectedUsers.includes('$') ? nwEv.data.selectedUsers.split(',$, ') : [nwEv.data.selectedUsers]
      


      console.log('selected', selected)
      
      const add = await axios.post('api/event/user', nwEv)

      for(let i in selected){
        axios.get(`/api/user/name/${selected[i]}`)
        .then((user) => {
          nwEv['userId'] = user.data.id
          axios.post('/api/event/user', nwEv)
          .then((data) => {
            console.log('added!', data)
          })
        })
      }

      // eslint-disable-next-line no-shadow
      const dates = data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        selectedUsers: event.selectedUsers.split(',$, ')
      }));
    } catch (err) {
      console.error('Error posting event: ', err);
    }
  };

  return (
    <div style={{
      flexGrow: 1, margin: 0, marginTop: 0, padding: '15px', height: '80vh'
    }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', height: '100%' }}>
        <div style={{
          gridColumn: '1 / 2', padding: '10px', display: 'flex', flexDirection: 'column',
        }}
        >
          <h2>Create a new event:</h2>
          <EventForm event={event} setEventValue={setEventValue} users={users} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <button
              style={{
                backgroundColor: '#ddd',
                border: 'none',
                padding: '18px',
                borderRadius: '10px',
                marginRight: '10px'
              }}
              onClick={handleSubmit}
            >Add Event
            </button>
          </div>
        </div>
        <div style={{ gridColumn: '2 / 3' }}>
          <div style={{ height: '100%' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={(key) => {
                setEventValue('selectedEvent', key);
              }}
              style={{
                height: '100%',
                '&& .rbc-off-range-bg': {
                  backgroundColor: 'rgb(35, 39, 42)'
                }
              }}
            />
          </div>
        </div>
      </div>
      <EventDialog
        event={event.selectedEvent}
        onClose={() => setEventValue('selectedEvent', null)}
        fetchEvents={fetchEvents}
        users={users}
      />
    </div>


  //  MUI VERSION
  // <Box sx={{
  //   flexGrow: 1, m: 0, marginTop: 0, padding: '15px', height: '80vh'
  // }}
  // >
  //   <Grid container spacing={2} sx={{ height: '100%' }}>
  //     <Grid item xs={3}>
  //       <Paper style={{
  //         display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px'
  //       }}
  //       >
  //         <Typography variant="h5" gutterBottom>Create a new event:</Typography>
  //         <EventForm event={event} setEventValue={setEventValue} users={users} />
  //         <Container style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
  //           <Button variant="text" onClick={handleSubmit}>Add Event</Button>
  //         </Container>
  //       </Paper>
  //     </Grid>
  //     <Grid item xs={9}>
  //       <Paper sx={{ height: '100%' }}>
  //         <Calendar
  //           localizer={localizer}
  //           events={events}
  //           startAccessor="start"
  //           endAccessor="end"
  //           onSelectEvent={(key) => {
  //             console.log(key);
  //             setEventValue('selectedEvent', key);
  //           }}
  //           sx={{
  //             height: '100%',
  //             '&& .rbc-off-range-bg': {
  //               background: 'black'
  //             }
  //           }}
  //         />
  //       </Paper>
  //     </Grid>
  //   </Grid>
  //   <EventDialog
  //     event={event.selectedEvent}
  //     onClose={() => setEventValue('selectedEvent', null)}
  //     fetchEvents={fetchEvents}
  //     users={users}
  //   />
  // </Box>
  );
}

export default Events;
