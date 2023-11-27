const { Router } = require('express');
const axios = require('axios');
const { Chats } = require('../db/models');

const Chat = Router();

Chat.post('/', (req, res) => {
   const {eventId, createdAt, updatedAt} = req.body

    Chats.create({eventId, createdAt, updatedAt})
    .then(() => {
        console.log('ayooo')
    })

})




module.exports = Chat;