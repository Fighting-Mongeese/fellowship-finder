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

// get coordinates for event(s) provided address(es)
// array of addresses in req body
Event.get('/coordinates', async (req, res) => {
  const { queries } = req.body.locations;

  const apiUrlBeginning = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  const apiUrlEnd = '.json?proximity=ip&access_token=pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNsb3hkaDFmZTBjeHgycXBpNTkzdWdzOXkifQ.BawBATEi0mOBIdI6TknOIw';

  const queryPromises = queries.map((query) => {
    const queryString = query.join('%20');
    const apiUrl = apiUrlBeginning + queryString + apiUrlEnd;
    return new Promise((resolve, reject) => {
      axios.get(apiUrl)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error('SERVER ERROR: could not GET coordinates from api', error);
        });
    });
  });

  try {
    const coordinates = await Promise.all(queryPromises);
    return res.status(200).send(coordinates);
  } catch (error) {
    console.error(error);
  }
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
})

Event.post('/user', (req, res) => {
  const {id, createdAt, updatedAt} = req.body.data
  const {userId} = req.body

  console.log('bod', req.body)

  UserEvents.create({userId, eventId: id, createdAt, updatedAt})
  .then((event) => {
    console.log('pop', event.dataValues)
    res.status(201).send(event.dataValues)
  })
})

Event.get('/user/:userId', (req, res) => {
  const {userId} = req.params
  UserEvents.findAll({where: {userId}})
  .then((events) => {
    res.status(200).send(events)
  })
})

module.exports = Event;
