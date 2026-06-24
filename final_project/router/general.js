const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 1 - Get all books (async/await)
public_users.get('/', async function (req, res) {
  try {
    const response = await new Promise((resolve) => resolve(books));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2 - Get book by ISBN (async/await)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      const result = books[isbn];
      result ? resolve(result) : reject(new Error("Book not found"));
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 3 - Get books by author (async/await)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const result = await new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(
        b => b.author.toLowerCase().includes(author.toLowerCase())
      );
      matches.length > 0 ? resolve(matches) : reject(new Error("No books found"));
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4 - Get books by title (async/await)
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const result = await new Promise((resolve, reject) => {
      const matches = Object.values(books).filter(
        b => b.title.toLowerCase().includes(title.toLowerCase())
      );
      matches.length > 0 ? resolve(matches) : reject(new Error("No books found"));
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
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