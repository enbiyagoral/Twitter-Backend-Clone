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
        type: Array
    }],
    dislikes: [{
        type: Array
    }],
    saves: [{
        type: Array
    }]

},{timestamps:true});

const Tweet = mongoose.model('Tweet',tweetSchema);

module.exports = Tweet