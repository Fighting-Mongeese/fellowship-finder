import React, { useEffect, useRef, useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { Button } from '@mui/material';
// import PlaceIcon from '@mui/icons-material/Place';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Place, AccountCircle } from '@mui/icons-material';
import { Map, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import { UserContext } from '../components/UserProvider';
import EventTable from '../components/EventTable';
import dayjs from 'dayjs';

const MapPage = () => {
  const markerClicked = (event) => {
    window.alert(`${event.title}: ${dayjs(event.start).format('ddd MMM DD YYYY h:mm a')}`);
  };

  // both inPerson and online events populate EventTable
  const [events, setEvents] = useState([]);
  // only inPerson events added to Map
  const [inPersonEvents, setInPersonEvents] = useState([]);
  // sorted events added to map as markers
  const [currentMarkers, setCurrentMarkers] = useState([]);

  const [userAddress, setUserAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const [userCoordinates, setUserCoordinates] = useState([]);

  const mapRef = useRef(null);

  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 6,
  });

  const { activeUser, setActiveUser } = useContext(UserContext);

  function centerMap(eventsArray) {
    const latitudes = [];
    const longitudes = [];

    eventsArray.forEach((event) => {
      if (event.long !== 0 && event.lat !== 0 && event.isInPerson === true) {
        latitudes.push(event.lat);
        longitudes.push(event.long);
      }
    });

    const avgLatitude = latitudes.reduce((acc, cur) => acc + cur, 0) / latitudes.length;
    const avgLongitude = longitudes.reduce((acc, cur) => acc + cur, 0) / longitudes.length;
    mapRef.current?.flyTo({ center: [avgLongitude, avgLatitude] });
  }

  useEffect(() => {
    // get all events
    async function getEvents() {
      const eventsResponse = await axios.get('/api/event/all');
      setEvents(eventsResponse.data);
      return eventsResponse.data;
    }

    // run map logic based on getting events
    getEvents()
      .then((eventsArray) => {
        // console.log('eventsArray', eventsArray);
        const filteredEvents = eventsArray.filter((event) => {
          return event.isInPerson === true;
        })
        // Calculate and set longitude and latitude state
        setInPersonEvents(filteredEvents);
        setCurrentMarkers(filteredEvents);
        centerMap(eventsArray);
      });
  }, []);

  function flyToCoordinates(long, lat) {
    if (long === null && lat === null) {
      alert('This event is online! Check the link column in the table!');
    } else {
      mapRef.current?.flyTo({ center: [long, lat] });
    }
  }

  function sortMarkersByAttendee(username) {
    // for single user
    if (username) {
      const userEvents = inPersonEvents.filter((event) => {
        return event.selectedUsers.includes(username);
      });

      setCurrentMarkers(userEvents);
    } else { // for all users
      setCurrentMarkers(inPersonEvents);
    }
  }

  function handleAddressChange(e) {
    console.log(e.target);
    setUserAddress((prevAddress) => {
      return {
        ...prevAddress,
        [e.target.name]: e.target.value
      };
    });
  }

  async function handleAddressSubmission() {
    console.log('USER ADDRESS', userAddress);
    const { street, city, state, zip } = userAddress;
    let addressString = `${street} ${city} ${state} ${zip}`;
    addressString = addressString.replaceAll(' ', '%20');

    const coordinatesResponse = await axios.get(`/api/event/coordinates/${addressString}`)
      .catch((err) => console.error('CLIENT ERROR: could not GET user coordinates', err));

    const coordinates = coordinatesResponse.data;
    setUserCoordinates(coordinates);
    flyToCoordinates(coordinates[0], coordinates[1]);
  }

  const inputStyle = {
    height: 30,
  }

  // console.log('STATE. events: ', events, 'currentMarkers', currentMarkers, 'activeUser', activeUser, 'viewState', viewState, 'userAddress', userAddress);

  //const now = new Date();
  //console.log('now', now);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-evenly', marginTop: '15px' }}>
        <input style={inputStyle} name="street" placeholder="street" onChange={handleAddressChange} value={userAddress.street} />
        <input style={inputStyle} name="city" placeholder="city" onChange={handleAddressChange} value={userAddress.city} />
        <input style={inputStyle} name="state" placeholder="state" onChange={handleAddressChange} value={userAddress.state} />
        <input style={inputStyle} name="zip" placeholder="zip" onChange={handleAddressChange} value={userAddress.zip} />
        <Button onClick={handleAddressSubmission}>Find My Location</Button>
        <Button variant="contained" onClick={() => sortMarkersByAttendee()}>Pin All Events</Button>
        <Button variant="contained" onClick={() => sortMarkersByAttendee(activeUser.username)}>Pin My Events</Button>
      </div>
      <div>
        <div>
          <EventTable events={events} flyToCoordinates={flyToCoordinates} />
        </div>
        <div>
          <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
            style={{ position: 'absolute', top: '275px', left: '35px', width: '45vw', height: 500 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >

            {currentMarkers && currentMarkers.map((event, index) => {
              return (
                <Marker key={`${event.long}-${event.lat}-${index}`} onClick={() => markerClicked(event)} longitude={event.long} latitude={event.lat} anchor="bottom"> <Place
                  sx={{ color: new Date(event.start) > new Date() ? '#357977' : '#020B98' }}
                  fontSize="large"
                /></Marker>
              );
            })}

            {
              userCoordinates[1]
              && (
                <Marker
                  longitude={userCoordinates[0]}
                  latitude={userCoordinates[1]}
                  anchor="bottom"
                >
                  <AccountCircle
                    sx={{ color: 'black' }}
                    fontSize="large"
                  />

                </Marker>
              )
            }

            <NavigationControl />

          </Map>
        </div>
      </div>
    </div>
  );
};

export default MapPage;

