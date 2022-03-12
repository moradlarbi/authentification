const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose")
const userSchema = new Schema({
    type: {
        type: String,
        default: "user"
    }
});
userSchema.plugin(passportLocalMongoose)
var Users = mongoose.model('User', userSchema);

module.exports = Users;