const auth = require('basic-auth');
const User = require('../models').User;

function authorize(req, res, next) {
  const creds = auth(req);
  if(creds) {
    User.authenticate(creds.name, creds.pass, function (err, user) {
      if (err || !user) {
        var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else {
          req.doc = user;
          return next();
        
      }
    });
  } else {
    return next();
  }
 
}

module.exports.authorize = authorize;