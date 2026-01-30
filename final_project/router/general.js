const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;
  // check if username and password are provided
  if(username && password) {
    //check if the user is valid
    if(!isValid(username)) {
      users.push({"username":username,"password":password});
      res.send(`User ${username} registered successfully.`);
    } else {
      res.status(200).send(`User ${username} already exists.`);
    }
  }
  res.send("Unable to register user. Please provide both username and password.")
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  console.log("Fetching...");
  axios.get('http://localhost:5000/books')
  .then((response) => {
   return res.send(JSON.stringify(response.data, null, 4));
  }).catch(err => {
    res.send("Error: " + err);
  })
});

// Get book details based on ISBN
public_users.get('isbn/:isbn', async function(req, res) {
  let isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    if(response.data[isbn]) {
      return res.send(JSON.stringify(response.data, null, 4));
    } else {
      return res.send(`Book with ISBN ${isbn} not found`);
    }
  }
  catch (error) {
    res.send("Error: " + error);
  }
})
  
// Get book details based on author
public_users.get('author/:author', async function(req, res) {
  let author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(JSON.stringify(response.data, null, 4));
  }
  catch(error) {
    res.send("Error: " + error);
  }
})

// Get all books based on title
public_users.get('title/:title', async function(req, res) {
  let title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(JSON.stringify(response.data, null, 4));
  }
  catch(error) {
    res.send("Error: " + error);
  }
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.values(books).find(book => book.isbn === isbn);
  if(book) {
    let review = book.reviews;
    if(review.length > 0){
      res.send(JSON.stringify({reviews: book.reviews}, null, 4));
    } else {
      res.send(`Book with ISBN ${isbn} not found`);
    }
  }
});

module.exports.general = public_users;
