const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let isbn = [];

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

app.use(session({ secret: "fingerpint" }, resave = true, saveUninitialized = true));

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', async function (req, res) {

  await new Promise(resolve => setTimeout(resolve, 0));

  res.send(JSON.stringify(books, null, 4));
});



// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  res.send(books[author])
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  res.send(books[author])
});

async function getBookDetailsByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/books/title/${title}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book details by title:', error);
    throw error;
  }
}



async function getBookDetailsByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/books?author=${author}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book details by author:', error);
    throw error;
  }
}



const axios = require('axios');

// Function to get book details by ISBN using async-await
async function getBookDetailsByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:3000/books/${isbn}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
