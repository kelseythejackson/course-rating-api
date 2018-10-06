const express = require('express');
const auth = require('basic-auth');
const router = express.Router();
const User = require('../models').User;
const mid = require('../middleware');

// Returns the currently authenticated user
router.get('/', mid.authorize, (req, res, next) => {
  const creds = auth(req);

  // Checks if 'cred' exists
  if (creds) {
    if (creds.name === req.doc.emailAddress) {
      res.send(req.doc);
    }
  }

  let err = new Error('You\'e not currently logged in, so you can\'t view this user');
  err.status = 401;
  next(err);

});

// Creates a new user
router.post('/', (req, res, next) => {
  let user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.redirect('/');
  })
});


module.exports = router;