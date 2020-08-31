const mongoose = require('mongoose');

const { Schema } = mongoose;
const ChatSchema = new Schema({
    receiver_id: String,
    sender_id: String,
    text: String,
    createdAt: Date,
    user: Object
})
module.exports = mongoose.model('Chats', ChatSchema);