const express = require('express');
const router = express.Router();
const mid = require('../middleware');
const Course = require('../models').Course;
const Review = require('../models').Review;

router.get('/', (req, res, next) => {
  Course.find().select('title').then((courses) => {
    res.send(courses);
  })
});

router.post('/', mid.authorize, (req, res, next) => {
  let course = new Course(req.body);
  course.save((err, course) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.redirect('/');

  })
});

router.get('/:courseId', mid.authorize, (req, res, next) => {
  Course.findById(req.params.courseId).populate('reviews').populate('user', '_id fullName').then((course) => {
    res.send(course);
  })
});

router.put('/:courseId', mid.authorize, (req, res, next) => {
  Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
    upsert: true
  }, (err, course) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    res.status(204);
    res.redirect('/');
  });
});



router.post('/:courseId/reviews', mid.authorize, (req, res, next) => {
  Course.findById(req.params.courseId).populate('reviews').populate('user').then((course) => {
    req.body.user = req.doc;

    let review = new Review(req.body);
    review.validateUser(req.body.user, course.user, function(err) {
      if(err) {
        err.status = 400;
        return next(err)
      }

      review.save((err, review) => {
        if (err) {
          err.status = 400;
          return next(err);
        } else {
          res.status(201);
          course.reviews.push(review);
          course.save();
          res.redirect('/');
        }
  
      });
    });
    


  })
});




module.exports = router;