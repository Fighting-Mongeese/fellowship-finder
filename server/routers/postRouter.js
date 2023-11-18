const sequelize = require('sequelize');
const express = require('express');
// const router = express.Router();
const { Router } = require('express');
const { Posts, User } = require('../db/models.js');
//NOTE MAY HAVE TO MATCH other routers
//const { Post } = require('../db/models')

const Post = Router();

Post.get('/all', async (req, res) => {
  try {
    const posts = await Posts.findAll({
      order: [
        ['id', 'DESC']
      ],
      include: [
        {
          model: User
        },
        // sequelize.fn(
        //   'DATE_FORMAT',
        //   sequelize.col('paymentDate'),
        //   '%d-%m-%Y %H:%i:%s'
        // ),
      ]
    });
    //console.log('PostGet', posts);
    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while retrieving posts' });
  }
});


Post.post('/add', (req, res) => {
  const post = req.body;
  //console.log('post.post', post);
  Posts.create({
    userId: post.userId,
    post: post.post,
    upVotes: post.upVotes
  })
    .then((data) => {
      //console.log(data);
      res.status(201)
        .send(data);
    })
    .catch((err) => {
      console.error('Failed to Create post', err);
      res.sendStatus(500);
    });
});

Post.patch('/:id', (req, res) => {
  console.log('patch', req.params, req.body);
  const { id } = req.params;
  const { edit } = req.body;
  console.log('edit', edit);
  Posts.findByPk(id)
    .then((post) => {
      post.update(edit);
      console.log('post edit', post, edit);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Failed to edit post', err);
      res.sendStatus(500);
    });
});

Post.delete('/:id', (req, res) => {
  //console.log(req.params);
  const { id } = req.params;
  Posts.findByPk(id)
    .then((post) => {
      post.destroy();
      //console.log('post', post);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('Failed to delete post', err);
      res.sendStatus(500);
    });
});

module.exports = Post;
