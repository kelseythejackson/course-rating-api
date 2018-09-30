const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const server = require('../index');
const User = require('../models/index').User;

const assert = require('assert');


chai.use(chaiHttp);

describe('/GET users', () => {
  it('should return the authenticated user', (done) => {
    chai.request(server)
    .get('/api/users')
    .set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
    .end( (err, res) => {
        if (err) {
            return done(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.emailAddress).to.equal('joe@smith.com');
        expect(res).to.be.json;

        done();
    });

   
   
    // chai.request(server)
    // .get('/api/users')
    // .set('Authorization', 'Basic joe@smith.com:password')
    // .end((err, res) => {
    //   if(err) {
    //     return done(err);
    //   }
    //   expect(res).to.have.status(200);
    //   expect(res.body.emailAddress).to.eq('joe@smith.com');
    
  })

  it('should return a 401 error because the credentials are invalid', (done) => {
    chai.request(server)
    .get('/api/users')
    .set('Authorization', 'Basic ZGdqa2xkZmo6ZGZnZGZo')
    .end( (err, res) => {
        if (err) {
            return done(err);
        }
        expect(res).to.have.status(401);
      

        done();
  })
});
});

