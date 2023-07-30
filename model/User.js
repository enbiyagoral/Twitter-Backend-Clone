const mongoose = require('mongoose');
const {Schema} = mongoose;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
        date: Date.now,
    }],
    followed: [{
        type: Array
    }],
    follower: [{
        type: Array
    }],
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }],
    saved: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }]
},{timestamps:true});

userSchema.methods.createAuthToken = () =>{
    return jwt.sign({_id:this._id}, process.env.JWT_PRIVATE_KEY)
};


const User = mongoose.model('User',userSchema);

module.exports = User;
