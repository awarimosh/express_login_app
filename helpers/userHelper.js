const config = require('../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.authenticate = (password,user) => {
    if (user && bcrypt.compareSync(password, user.hash)) {
        // authentication successful
        return{
            success : true,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            message : "password correct",
            token: jwt.sign({ sub: user._id }, config.secret)
        };
    } else {
        // authentication failed
        return{
            success : false,
            message : "incorrect password"
        };
    }
};

exports.registration = (user) => {
    // add hashed password to user object
    console.log('user',user);
    user.hash = bcrypt.hashSync(user.password, 10);
    return user;
};