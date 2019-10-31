/* eslint-disable linebreak-style */
/* eslint comma-dangle: ["error", "never"] */
/* eslint no-unused-vars: ["error", {"args": "none"}] */

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
// const cloudinary = require('cloudinary').v2;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// admin can create an employee user account
app.post('/api/v1/auth/create-user', (req, res, next) => {
  res.status(201).json({
    status: 'success',
    data: {
      message: 'User account successfully created!',
      token: '',
      userId: 8765
    }
  });
});

// Admin/Employee can login a user
app.post('/api/v1/auth/signin', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: { token: '', userId: 23456 }
  });
});

// employees can post gifs
app.post('/api/v1/gifs', (req, res, next) => {
  res.status(201).json({
    status: 'success',
    data: {
      gifId: 1,
      message: 'GIF image successfully posted',
      createdOn: moment().format('MMMM Do YYYY, h:mm:ss a'),
      title: '',
      imageUrl: ''
    }
  });
});

// employees can post articles
app.post('/api/v1/articles', (req, res, next) => {
  res.status(201).json({
    status: 'success',
    data: {
      message: 'Article successfully posted',
      articleId: 1,
      createdOn: moment().format('MMMM Do YYYY, h:mm:ss a'),
      title: ''
    }
  });
});

// employees can comment on other colleagues' article post
app.post('/api/v1/articles/:articleId/comment', (req, res, next) => {
  res.status(201).json({
    status: 'success',
    data: {
      message: 'Comment successfully created',
      createdOn: moment().format('MMMM Do YYYY, h:mm:ss a'),
      articleTitle: '',
      article: '',
      comment: ''
    }
  });
});

// employees can comment on other colleagues' gif post
app.post('/api/v1/gifs/:gifId/comment', (req, res, next) => {
  res.status(201).json({
    status: 'success',
    data: {
      message: 'Comment successfully created',
      createdOn: moment().format('MMMM Do YYYY, h:mm:ss a'),
      gifTitle: '',
      comment: ''
    }
  });
});

// employees can edit their articles
app.patch('/api/v1/articles/:articleId', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Article successfully updated',
      title: '',
      article: ''
    }
  });
});

// employees can delete their articles
app.delete('/api/v1/articles/:articleId', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Article successfully deleted'
    }
  });
});

// employees can delete their gifs
app.delete('/api/v1/gifs/:gifId', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'gif post successfully deleted'
    }
  });
});

app.get('/api/v1/', (req, res) => {
  res.json({ message: 'Server starts successfully!' });
});

module.exports = app;
