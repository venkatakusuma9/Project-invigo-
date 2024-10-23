const mongoose = require('mongoose');

const facUserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    profileImage: {
        data: Buffer,
        contentType: String
    }
});

const FacUser = mongoose.model('FacUser', facUserSchema);

module.exports = FacUser;
