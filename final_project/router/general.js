const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 1: Get the list of books available in the shop
public_users.get('/books', (req, res) => {
    res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get book details based on title
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book reviews based on ISBN
public_users.get('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the list of books available in the shop using Axios
public_users.get('/books/axios', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Adjust URL as needed
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN using Axios
public_users.get('/books/axios/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 12: Get book details based on author using Axios
public_users.get('/books/axios/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/books/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching books by author:", error);
        res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 13: Get book details based on title using Axios
public_users.get('/books/axios/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/books/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching books by title:", error);
        res.status(404).json({ message: "No books found with this title" });
    }
});

module.exports.general = public_users;
