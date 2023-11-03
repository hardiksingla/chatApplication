const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  username: { type: String, unique: true, required: true},
  password: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  friends: {type: Array, default: []},
});

const messageSchema = new mongoose.Schema({
  conversationID: {type: String, required: true},
  sender: {type: mongoose.Schema.Types.ObjectId , ref: "User", required: true},
  message: {type: String, required: true},
  time: {type: Date, default: Date.now}
});

const conversationSchema = new mongoose.Schema({
  members: {type: Array, required: true},
  messages: [{type: mongoose.Schema.Types.ObjectId , ref: "Message"}],
});


const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
const User = mongoose.model('User', userSchema);
module.exports = {Conversation, Message, User}