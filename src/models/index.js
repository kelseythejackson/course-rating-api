const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({emailAddress: email})
  .exec(function(error, user) {
 
    if (error) {
      return callback(error);
    } else if ( !user) {
      const err = new Error('User not found');
      err.status = 401;
      return callback(err);
    }
    
    

    bcrypt.compare(password, user.password, function(error, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        const error = new Error('Invalid password entered.');
				error.status = 401;
				return callback(error);
      }
    });
  })
};

UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: String
});

ReviewSchema.method('validateUser', function(reviewer, courseCreator, callback) {
  const reviewerId = reviewer._id.toString();
  const courseCreatorId = courseCreator._id.toString();
  if(reviewerId === courseCreatorId) {
    const err = new Error('You can\'t review your own course');
    err.status = 401;
    callback(err)
  } else {
    callback();
  }
}); 
const CourseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedTime: String,
  materialsNeeded: String,
  steps: [{
    stepNumber: Number,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);;
const Review = mongoose.model('Review', ReviewSchema);;

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;