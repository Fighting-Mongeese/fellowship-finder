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

const MapPage = () => {
  const markerClicked = (event) => {
    window.alert(event.title);
  };

  const [events, setEvents] = useState([]);
  const [inPersonEvents, setInPersonEvents] = useState([]);
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
    console.log('flying!');
    mapRef.current?.flyTo({ center: [long, lat] });
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

  const layerStyle = {
    id: 'point',
    type: 'circle',
    source: 'mapbox',
    paint: {
      'circle-radius': activeUser ? activeUser.maxTravelDist : 10,
      'circle-color': '#007cbf'
    }
  };

  console.log('STATE. events: ', events, 'currentMarkers', currentMarkers, 'activeUser', activeUser, 'viewState', viewState, 'userAddress', userAddress);
  return (
    <div>
      <input name="street" placeholder="street" onChange={handleAddressChange} value={userAddress.street} />
      <input name="city" placeholder="city" onChange={handleAddressChange} value={userAddress.city} />
      <input name="state" placeholder="state" onChange={handleAddressChange} value={userAddress.state} />
      <input name="zip" placeholder="zip" onChange={handleAddressChange} value={userAddress.zip} />
      <Button onClick={handleAddressSubmission}>Find My Location</Button>

      <EventTable events={events} flyToCoordinates={flyToCoordinates} />
      <div style={{ top: '250px', width: '45%', margin: '20px', height: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <div style={{ display: 'flex', flexDirection: 'row', margin: '5px' }}>
          <Button style={{ margin: '5px' }} variant="contained" onClick={() => sortMarkersByAttendee()}>Pin All Events</Button>
          <Button style={{ margin: '5px' }} variant="contained" onClick={() => sortMarkersByAttendee(activeUser.username)}>Pin My Events</Button>
        </div>
      </div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken="pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw"
        style={{ position: 'absolute', bottom: '0px', width: 600, height: 400 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >

        {currentMarkers && currentMarkers.map((event, index) => {
          return (<Marker key={`${event.long}-${event.lat}`} onClick={() => markerClicked(event)} longitude={event.long} latitude={event.lat} anchor="bottom"> <Place
            sx={{ color: 'black' }}
            fontSize="large"
          /></Marker>);
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

              <Layer {...layerStyle} />

            </Marker>
          )
        }

        <NavigationControl />

      </Map>
      <Button variant="contained" onClick={() => flyToCoordinates(-45, 45)}>map2 fly</Button>
    </div>
  );
};

export default MapPage;

