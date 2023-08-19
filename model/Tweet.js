const mongoose = require('mongoose');
const {Schema} = mongoose;

const tweetSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }],
    saves: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    }]

},{timestamps:true});

const Tweet = mongoose.model('Tweet',tweetSchema);

module.exports = Tweet