const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to authenticate user
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Get username and password from request body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }
  const token = jwt.sign({ username }, 'your_jwt_secret'); // Use your JWT secret here
  req.session.token = token; // Save JWT in the session
  return res.status(200).json({ message: "Login successful", token });
});

// Add or Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Get the ISBN from the request parameters
  const review = req.query.review; // Get the review from the query parameters
  const username = req.user.username; // Get the username from the session or JWT

  if (!review) {
      return res.status(400).json({ message: "Review text is required." });
  }

  if (!username) {
    return res.status(403).json({ message: "User must be logged in to review." });
  }

  // Find the book by ISBN
  let book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user already has a review for this book
  const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
  
  if (existingReviewIndex >= 0) {
    // User already has a review, update it
    book.reviews[existingReviewIndex].review = review;
  } else {
    // New review, add it
    book.reviews.push({ username, review });
  }

  return res.status(200).json({ message: "Review added/updated successfully." });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session; // Get the username from the session
  const { isbn } = req.params; // Get ISBN from URL parameters

  if (!username) {
    return res.status(403).json({ message: "User must be logged in to delete a review." });
  }

  // Find the book by ISBN
  let book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Filter out the review for this username
  const originalLength = book.reviews.length;
  book.reviews = book.reviews.filter(r => r.username !== username);
  
  if (book.reviews.length === originalLength) {
    return res.status(404).json({ message: "No review found for this user." });
  }

  return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
