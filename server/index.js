const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model')
var jwt = require('jsonwebtoken');



main().catch(err => console.log("database error"));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  }

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

let cors = require("cors");
app.use(cors());


app.listen(3000, function () {
  console.log("Server running at port 3000");
});

app.get("/", function (req, res) {
  res.send(data)
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
  console.log(req.body.search)
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

  User.updateOne({ _id:currentUserID.id }, {$push:{ friends:req.body.friendID}})
  .then(result => {
    return res.json({ status: 'ok' })
  })
  .catch(err => {
    return res.json({ status: 'error', error: 'Already a friend' })
  });
})

app.post("/api/getFriends", async function(req,res){
  const currentUserID = jwt.verify(req.body.currentUserID, 'secretKey');
  const user = await User.findOne({ '_id': currentUserID.id});

  const friends = user.friends;
  for (let i = 0; i < friends.length; i++) {
    console.log(friends[i])
  }

})