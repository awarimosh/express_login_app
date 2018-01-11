const Users = require('../models/users');
const status = require('http-status');

exports.getAllUsers = (req,res) => {
    Users.find({}, (err,result) => {
        if(err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(result);
    });
};

exports.getUser = (req,res) => {
    const email = req.params.email;
    Users.findOne({'email' : email}, (err,result) => {
        if(err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(result);
    } )
};

exports.createUser = (req,res) => {
    const newUser = new Users(req.body);
    newUser.save((err,result) => {
        if(err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(result);
    })
};

exports.updateUser = (req,res) => {
    const data = req.body;
    const query = { email: data.email };

    Users.update(query,{
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password
    }, (err, numberAffected, rawResponse) => {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(rawResponse);
    })
};