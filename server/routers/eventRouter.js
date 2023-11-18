const { Router } = require('express');
const axios = require('axios');
const { Events, UserEvents } = require('../db/models');

const Event = Router();

Event.get('/all', async (req, res) => {
  try {
    const events = await Events.findAll();
    return res.json(events);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving events' });
  }
});

Event.get('/coordinates/:address', async (req, res) => {
  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';


  console.log('here', req.params);
  const { address } = req.params;
  console.log(address);
  // let queryString = `${address.street} ${address.city} ${address.state} ${address.zip}`;
  // queryString = queryString.replaceAll(' ', '%20');

  const apiUrl = apiUrlBeginning + address + apiUrlEnd;

  const coordinateResponse = await axios.get(apiUrl).catch((error) => console.error(error));
  const coordinates = coordinateResponse.data.features[0].center;
  res.status(200).send(coordinates);
  // res.sendStatus(200);
});

Event.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Events.findByPk(id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving event' });
  }
});


Event.post('/', async (req, res) => {
  const event = req.body;

  try {
    if (event.isInPerson) {
      const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
      const apiUrlEnd = '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';

      let queryString = `${event.street} ${event.city} ${event.state} ${event.zip}`;
      queryString = queryString.replaceAll(' ', '%20');

      const apiUrl = apiUrlBeginning + queryString + apiUrlEnd;

      const coordinateResponse = await axios.get(apiUrl).catch((error) => console.error(error));
      const coordinates = coordinateResponse.data.features[0].center;

      const [long, lat] = coordinates;
      event.lat = lat;
      event.long = long;
    }

    const newEvent = await Events.create(event);
    return res.json(newEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating event' });
  }
});

Event.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const newEvent = req.body;
  console.log(id, newEvent);
  try {
    const event = await Events.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.update(newEvent);
    return res.status(200).json({ message: 'Event updated' });
  } catch (error) {
    console.error('Failed to PATCH event BY ID:', error);
    return res.status(500).json({ error: 'An error occurred while updating event' });
  }
});

Event.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Events.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.destroy();
    return res.status(200).json({ message: 'Event deleted ' });
  } catch (error) {
    console.log('An error occurred while deleting event', error);
    return res.status(500).json({ error: 'An error occurred while deleting event' });
  }
});

Event.post('/user', (req, res) => {
  const {id, createdAt, updatedAt, title} = req.body.data
  const {userId} = req.body

  console.log('bod', req.body.data)

  UserEvents.create({userId, eventId: id, createdAt, updatedAt, title})
  .then((event) => {
    console.log('pop', event.dataValues)
    res.status(201).send(event.dataValues)
  })
})

Event.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  UserEvents.findAll({ where: { userId } })
    .then((events) => {
      res.status(200).send(events);
    });
});

Event.get('/host/:hostId', (req, res) => {
  const { hostId } = req.params;
  console.log(hostId)
  Events.findAll({ where: { hostId } })
    .then((resp) => {
      console.log('HEY', resp);
      res.status(200).send(resp)})
    .catch((err) => console.log('BYE', err));
});

module.exports = Event;
