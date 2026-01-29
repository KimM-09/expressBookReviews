const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "user1",
    "password": "password1"
  },
  {
    "username": "user2",
    "password": "password2"
  }
];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
//filter the users array to check if the username already exists
let userWithSameName = users.filter(user => {
  return user.username === username;
})
// Return true if any user with the same username is found, otherwise false
if(userWithSameName.length > 0) {
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validUser = users.filter(user => {
  return (user.username === username && user.password === password);
})
if(validUser.length > 0) {
  return true;
} else {
  return false;
}
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password) {
    res.send("Error logging in. Please provide both a username and password.");
  }

  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});

    //store the access token and username in session
    req.session.authorization = {
      accessToken, username
    };
    res.send(`User ${username} logged in successfully.`);
  } else {
    res.send("Invalid username or password.");
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let book = Object.values(books).find(book => book.isbn === isbn);
  let review = req.query.review;
  let username = req.query.username;
  let bookReviews = book.reviews;

  if(!book){
    res.send(`Book with ISBN ${isbn} not found`);
  } else if(!username || !review){
    res.send("Please provide both username and review to add a book review")
  } else {
    const userReview = bookReviews.find(review => review.username === username);
    if(userReview) {
      userReview.review = review;
      res.send(`Review for book with ISBN ${isbn} updated successfully for user ${username}`);
    } else {
      bookReviews.push({username: username, review: review});
      res.send(`Review for book with ISBN ${isbn} added successfully for user ${username}`);
    }
  }
  
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users.
  let isbn = req.params.isbn;
  let book = Object.values(books).find(book => book.isbn === isbn);
  let username = req.query.username;
  let bookReviews = book.reviews;

  if(!book) {
    res.send(`Book with ISBN ${isbn} not found`);
  } else if(!username) {
    res.send("Please provide a username to delete a book review");

  } else {
    const reviewIndex = bookReviews.findIndex(review => review.username === username);
    if(reviewIndex !== -1) {
     bookReviews.splice(reviewIndex, 1);
     res.send(`Review for book with ${isbn} deleted successfully for user ${username}`);  
    } else {
      res.send(`No review found for book with ISBN ${isbn} by user ${username}`);
    }
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
