const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {User,Message,Conversation} = require('./model');
var jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const { createServer } = require('http');
const path = require("path");
require('dotenv').config()



const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected:",conn.connection.host);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
}
connectDB()

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));


const corsOptions = {
  origin: "*",
};

let cors = require("cors");
app.use(cors(corsOptions));

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
console.log(__dirname1)
if ("production" === "production") {
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

const server = app.listen(3000, function () {
  console.log("Server running at port 3000");
});


const io = require('socket.io')(server, {
  pingTimeout: 60000, 
  cors: {
    origin: '*',
  }
  
});


app.post("/api/auth/signup", async function(req,res){
	
  try {
		await User.create({
      name: req.body.name, 
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email or username' })
    console.log(err)
	}
})

app.post("/api/auth/login", async function(req,res){
  var hashed = bcrypt.hashSync(req.body.password, 10);
  const user = await User.findOne({ 'username': req.body.username});
  if (!user) {
    return res.json({ status: 'error', error: 'Invalid username/password' })
  }
  var passwordValid = bcrypt.compareSync(req.body.password, user.password);
  var token = jwt.sign(
    {
      username: user.username,
      email: user.email,
      id: user._id
    },
    'secretKey');

  if (passwordValid) {
    res.json({ status: 'ok' ,user : token})
  } else {
    res.json({ status: 'error', error: 'Invalid username/password' })
  }
})

app.post("/api/search", async function(req,res){
  const substring = req.body.search;

  User.find({ username: { $regex: substring, $options: 'i' } })
  .select('username')
  .select("name")
  .select("email")

  .then(users => {
   
    res.json({ status: 'ok', users: users.map(user => user) })
  })
  .catch(err => {
    console.error('Error:', err);
  });
})

app.post("/api/addFriend", async function(req,res){
  const currentUserID = jwt.verify(req.body.currentUserID, 'secretKey');

  const user = await User.findOne({ '_id': currentUserID.id});
  for (let i = 0; i < user.friends.length; i++) {
    if (user.friends[i] == req.body.friendID) {
      return res.json({ status: 'error', error: 'Already a friend' })
    }
  }
  try{
    await Conversation.create({
      members: [currentUserID.id, req.body.friendID]
    })
  }catch(err){
    return res.json({ status: 'error', error: 'Cant Create Conversation' })
  }
  User.updateOne({ _id:req.body.friendID }, {$push:{ friends:currentUserID.id}})
  .then(result => {
  })
  User.updateOne({ _id:currentUserID.id }, {$push:{ friends:req.body.friendID}})
  .then(result => {
    return res.json({ status: 'ok' })
  })
  .catch(err => {
    return res.json({ status: 'error', error: 'Already a friend' })
  });
})

app.post("/api/friendList", async function(req,res){
  const currentUserID = jwt.verify(req.body.currentUserID, 'secretKey');
  const user = await User.findOne({ '_id': currentUserID.id});

  var allfriends = []
  const friends = user.friends;
  for (let i = 0; i < friends.length; i++) {
    fr = await User.findOne({ '_id': friends[i]})
    friend = {name: fr.name, username: fr.username,id: fr._id}
    allfriends.push(friend)   
  }
  res.json({ status: 'ok', friends: allfriends })

})

app.post("/api/getMessages", async function(req,res){
  const currentUserID = jwt.verify(req.body.userJWT, 'secretKey');
  const userDBId = req.body.friendID;
  const query = await Conversation.find({ members: { $all: [userDBId, currentUserID.id] } })
  if (query.length == 0) {
    return res.json({ status: 'error', error: 'No Conversation' })
  }
  const conversation = query[0];
  const messages = conversation.messages;
  const messagesData = []
  for(let i = 0; i < messages.length; i++){
    const message = await Message.findOne({ '_id': messages[i]})
    var isSender = false;
    if (message.sender == currentUserID.id){
      isSender = true;
    }
    messagesData.push({message: message.message, sender: isSender})
  }
  res.json({ status: 'ok', messages: messagesData})

})

app.post("/api/sendMessage", async function(req,res){
  const from = jwt.verify(req.body.user, 'secretKey');
  const query = await Conversation.find({ members: { $all: [req.body.to, from.id] } })
  if (query.length == 0) {
    return res.json({ status: 'error', error: 'No Conversation' })
  }
  const conversationID = query[0]._id;
  const message = await Message.create({conversationID: conversationID, sender: from.id, message: req.body.message})


  await Conversation.updateOne({ _id:conversationID }, {$push:{ messages:message}})

  res.json({ status: 'ok' })

})


// socket.io->>

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('message', (args) => {
    console.log('message',args)
    socket.broadcast.emit('message');

  });
});