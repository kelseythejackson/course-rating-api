const express = require('express');
const auth = require('basic-auth');
const router = express.Router();
const User = require('../models').User;
const mid = require('../middleware');

router.get('/', mid.authorize, (req, res, next) => {
  if(req.doc) {
    res.send(req.doc);
  } else {
    User.find().then((users)=> {
      res.send(users);
    });
  }
});


router.post('/', (req, res, next) => {
  let user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      res.sendStatus(400);
      return next(err);
    }
    res.send(user)
  })
});


module.exports = router;