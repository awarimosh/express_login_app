const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: false
    },
    created_at : Date,
    updated_at: Date
});

usersSchema.pre('save,',function (next) {
    const currentDate = new Date();
    this.updated_at = currentDate;
    if(!this.created_at)
        this.created_at = currentDate;
    next();
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
