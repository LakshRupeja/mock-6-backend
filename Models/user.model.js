const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: String,
    avatar: String,
    email: String,
    password: String
},{
    versionKey:false
})
const User = mongoose.model("user", userSchema)
module.exports = User;
