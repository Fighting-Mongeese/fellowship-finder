const express = require('express');
const passport = require('passport');
const path = require('path');
const cookieSession = require('cookie-session'); //
const User = require('./routers/userRouter');
const Chat = require('./routers/chatRouter');
const Sheet = require('./routers/sheetRouter');
const Event = require('./routers/eventRouter');
const Post = require('./routers/postRouter');
const message = require('./routers/messageRouter')
const Upload = require('./routers/upload.js');
const authRoutes = require('./routers/authRouter'); //
const profileRoutes = require('./routers/profileRouter'); //
const passportSetup = require('../config/passport-setup'); //
const keys = require('../config/keys');
const { sequelize } = require('./db/index');
const http = require('http')

// initilize App
const app = express();
const server = http.createServer(app)
// const {Server} = require('socket.io');
const io = require('socket.io')(server, {cors: {origin: "*"}})

// connect App to client
const clientPath = path.resolve(__dirname, '../dist');
app.use(express.static(clientPath));

// configure App
app.use(express.json());
app.use(cookieSession({
  // define expiration date of cookie (24 hrs)
  maxAge: 24 * 60 * 60 * 1000,
  // use key to encrypt cookie
  keys: ['anything']
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//ROUTERS
app.use('/api/user', User);
app.use('/chat', Chat)
app.use('/auth', authRoutes); //
app.use('/profile', profileRoutes); //
app.use('/sheet', Sheet);
app.use('/post', Post);
app.use('/upload', Upload);
app.use('/message', message);

//ROUTERS
// app.use('/api/user', User);
app.use('/api/event', Event);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
});



// ADD APP ROUTERS`
// app.get('/api/users', (req, res) => {
//   User.findAll()
//     .then((users) => {
//       res.status(200).send(users);
//     })
//     .catch((err) => {
//       console.error('Failed to FIND ALL users:', err);
//       res.sendStatus(500);
//     });
// });


module.exports = {app, io, server};
