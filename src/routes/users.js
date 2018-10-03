const express = require('express');
const auth = require('basic-auth');
const router = express.Router();
const User = require('../models').User;
const mid = require('../middleware');

router.get('/', mid.authorize, (req, res, next) => {
  const creds = auth(req);
  if(creds.name === req.doc.emailAddress) {
    res.send(req.doc);
  }
});


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