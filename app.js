//jshint esversion:6

require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

console.log(process.env.API_KEY)
// use the input from the front end 
app.use(bodyParser.urlencoded({extended: true}));

// use the css that we have in front end 
app.use(express.static("public"));

// use the view engine
app.set("view engine", "ejs");

// connect to the mongoose 
async function main(){
  await mongoose.connect("mongodb://127.0.0.1/userDB")
}
main().catch( err => console.log(err))

// create a schema 
const usersSchema = new mongoose.Schema ({
  email:String,
  password: String
});


usersSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// create a model 
const User = new mongoose.model("User", usersSchema)

app.get("/", function(req, res){
  res.render("home");
})

app.get("/login", function(req, res){
  res.render("login");
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err)
    } else {
      if(foundUser){
        if (foundUser.password === password){
          res.render("secrets")
        }
      }
    }
  });
})

app.get("/register", function(req, res){
  res.render("register");
})

app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save(function(err){
    if(err){
      console.log(err)
    } else {
      res.render("secrets")
    }
  })
})

app.listen(3000, function(){
  console.log("Server has started on port 3000")
})