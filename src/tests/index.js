const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const server = require('../index');
const User = require('../models/index').User;
const Course = require('../models/index').Course;
const bcrypt = require('bcrypt');

const assert = require('assert');


chai.use(chaiHttp);

describe('GET /users', () => {
    let user = new User({
        "fullName": "Kelsey Jackson",
        "emailAddress": "kelsey@jackson.com",
        "password": "kelseyjackson",
        "confirmPassword": "kelseyjackson"

    });
    
    it('should return the authenticated user', (done) => {

        chai.request(server)
            .get('/api/users')
            .auth('kelsey@jackson.com', 'kelseyjackson')
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body.emailAddress).to.equal(user.emailAddress);
                done();
            });
    })

    it('should return a 401 error because the credentials are invalid', (done) => {
        chai.request(server)
            .get('/api/users')
            .auth('not@toney.com', 'notAValidPass')
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res).to.have.status(401);


                done();
            })
    });
});

describe('GET /api/courses/:courseId', () => {
    let course = new Course({
        "title": "Fishscale",
        "description": "RAGU",
        "user": {
            "_id": "5bb4eb2672755561a6a97579"
        },
        "steps": [{
            "title": "Starting off",
            "description": "Blue and Cream"
        }]
    });
    console.log(course);

    it('should return a 401 error because the credentials are invalid', (done) => {
        chai.request(server)
            .get('/api/courses/:id')
            .auth('not@toney.com', 'notAValidPass')
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res).to.have.status(401);


                done();
            })
    });
});