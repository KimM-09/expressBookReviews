const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;
  // check if username and password are provided
  if(username && password) {
    //check if the user is valid
    if(!isValid(username)) {
      users.push({"username":username,"passwork":password});
      res.send(`User ${username} registered successfully.`);
    } else {
      res.send(`User ${username} already exists.`);
    }
  }
  res.send("Unable to register user. Please provide both username and password.")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.values(books).find(book => book.isbn === isbn);
  if(book) {
    res.send(JSON.stringify({book}, null, 4));
  } else {
    res.send(`Book with ISBN ${isbn} not found`);
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksByAuthor = Object.values(books).filter(book => book.author === author);
  if(booksByAuthor.length > 0) {
    res.send(JSON.stringify({booksByAuthor}, null, 4));
  } else {
    res.send(`No books found for author ${author}`);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksByTitle = Object.values(books).filter(book => book.title === title);
  if(booksByTitle.length > 0) {
    res.send(JSON.stringify({booksByTitle}, null, 4));
  } else {
    res.send(`No books found with title ${title}`);
  }
});

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
