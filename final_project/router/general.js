const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1 - Get all books using Promise
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) resolve(books);
    else reject("No books found");
  })
  .then((books) => res.status(200).json(books))
  .catch((err) => res.status(500).json({ message: err }));
});

// Task 2 - Get book by ISBN using async/await + Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/`);
    const allBooks = response.data;
    const book = allBooks[isbn];
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 3 - Get books by author using async/await + Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/`);
    const allBooks = response.data;
    const matches = Object.values(allBooks).filter(
      b => b.author.toLowerCase().includes(author.toLowerCase())
    );
    if (matches.length === 0) return res.status(404).json({ message: "No books found" });
    return res.status(200).json(matches);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 4 - Get books by title using async/await + Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/`);
    const allBooks = response.data;
    const matches = Object.values(allBooks).filter(
      b => b.title.toLowerCase().includes(title.toLowerCase())
    );
    if (matches.length === 0) return res.status(404).json({ message: "No books found" });
    return res.status(200).json(matches);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 5 - Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;