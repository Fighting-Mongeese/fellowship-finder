
const { default: axios } = require('axios');
const express = require('express');
const multer = require('multer');

const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bycrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const db = require('./db/index');
const { createSignature, uploadToCloudinary } = require('./cloudinary_helpers.js');
require('dotenv').config();

const { app, io, server } = require('./app');

const { cloudinaryKeys } = require('../config/keys');

//const app = require('./app');

const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: false }));

//app.use(cors({ origin: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001',], // ADD your instance's private ip address to this array (i think)
  credentials: true
}));

app.use(cookieParser('mySecretKey'));

// app.use(passport.initialize());
// app.use(passport.session());
require('./passportConfig')(passport);

const { User, Message } = require('./db/models'); // Assuming you have a User model defined



app.post('/signup', async (req, res) => {
  const {
    username,
    password,
    email,
    age,
    maxTravelDist,
    sober,
    canHost,
    DM,
    combatHeaviness,
    strategyHeaviness,
    roleplayFocus,
    storyFocus
  } = req.body;

  console.log(
    'adds',
    username,
    password,
    email,
    age,
    maxTravelDist,
    sober,
    canHost,
    DM,
    combatHeaviness,
    strategyHeaviness,
    roleplayFocus,
    storyFocus
  );

  try {
    const existingUser = await User.findOne({ where: { username } });
    const hashedPassword = bycrypt.hashSync(password, 10);
    if (existingUser) {
      await existingUser.update({
        username,
        password: hashedPassword,
        email,
        age,
        maxTravelDist,
        sober,
        canHost,
        DM,
        combatHeaviness,
        strategyHeaviness,
        roleplayFocus,
        storyFocus,
      });
      await existingUser.save();
    } else {
      const newUser = await User.create({
        username,
        password,
        email,
        age,
        maxTravelDist,
        sober,
        canHost,
        DM,
        combatHeaviness,
        strategyHeaviness,
        roleplayFocus,
        storyFocus
      });
      await newUser.save();
      res.status(201).send(newUser);
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send({ message: 'An error occurred during signup' });
  }
});

app.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.send('No user exists');
    }
    if (user) {
      // eslint-disable-next-line no-shadow
      req.login(user, (err) => {
        if (err) {
          throw err;
        }
        res.send({
          message: 'User signed in',
          user
        });
      });
    }
  })(req, res, next);
});

// eslint-disable-next-line consistent-return
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/signin');
}

app.get('/getUser', ensureAuthenticated, (req, res) => {
  res.send(req.user);
});


app.get('/getUser', (req, res) => {
  res.send(req.user);
});

app.use(express.json());


app.post('/authenticate', async (req, res) => {
  const { username } = req.body;


  try {
    const r = await axios.put(
      'https://api.chatengine.io/users/',
      { username, secret: username, first_name: username },
      { headers: { 'private-key': 'f6ef300d-fd54-4179-a2bb-2f20c0802a14' } }
    );
    return res.status(r.status).json(r.data);
  } catch (err) {
    return res.status(err.response.status).json(err.response.data);
  }
});

io.on('connection', (socket) => {
  console.log('Socket connection successful!')
  socket.on('message', (message) => {
    console.log('mimi', message)
    Message.create(message)
    .then((data) => {
      io.emit('return message', data.dataValues)
    })
  })

  socket.on('disconnect', () => {
    console.log('out');
  });
});

server.listen(PORT, (err) => {
  if (err) {
    console.error('server connection failed', err);
  }
  console.log(`Page running at: 127.0.0.1:${PORT}`);
});

