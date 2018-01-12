const Users = require('../models/users');
const status = require('http-status');
const userHelper = require('../helpers/userHelper');
var Q = require('q');

exports.getAllUsers = (req, res) => {
    Users.find({}, (err, result) => {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(result);
    });
};

exports.validateUser = (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    // console.log(email,password);
    Users.findOne({'email': email}, (err, result) => {
        if (err) return res.status(status.BAD_REQUEST).json(err);
        result = userHelper.authenticate(password, result);
        res.status(status.OK).json(result);
    });
};

exports.registerUser = (req, res) => {
    const data = req.body;
    create(data).then(function (user) {
        if (user) {
            // authentication successful
            res.status(status.OK).send(user);
        } else {
            // authentication failed
            res.status(status.BAD_REQUEST).send('Username or password is incorrect');
        }
    })
        .catch(function (err) {
            res.status(status.BAD_REQUEST).send(err);
        });
};

exports.createUser = (req, res) => {
    const newUser = new Users(req.body);
    newUser.save((err, result) => {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(result);
    })
};

exports.getUserById = (req, res) => {
    const id = req.params.id;
    Users.findById(id, function (err, userFound) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(userFound)
    });
};

exports.updateUser = (req, res) => {
    const data = req.body;
    const query = {email: data.email};

    Users.update(query, {
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password
    }, (err, numberAffected, rawResponse) => {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        res.status(status.OK).json(rawResponse);
    })
};

exports.deleteUserById = (req, res) => {
    const userId = req.params.userId;
    Users.findByIdAndRemove(userId, function (err) {
        if (err) return res.status(status.BAD_REQUEST).json(err);

        // The user has been deleted
        res.status(status.OK).json({message: 'SUCCESS'});
    });
};

function create(data) {
    var deferred = Q.defer();

    function createUser() {
        var newUser = userHelper.registration(data);
        newUser = new Users(newUser);
        newUser.save((err, result) => {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(result);
        });
    }

    Users.findOne(
        {email: data.email},
        (err, user) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (user) deferred.reject('email "' + data.email + '" is already taken');
            else
                createUser()
        }
    );
    return deferred.promise;
}