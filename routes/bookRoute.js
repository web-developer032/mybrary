const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");

const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]; // declaring which files we accept

// All Books
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title?.trim()) {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore) {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter) {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  try {
    const books = await query.exec();
    res.render("books/indexBook", { books, searchOptions: req.query });
  } catch (err) {
    console.log(err);
  }
});

// New Authors
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// All Authors
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });

  saveCover(book, req.body.coverImage);
  try {
    const newBook = await book.save();
    // res.redirect(`/books/${newBook.id}`);
    res.redirect("/books");
  } catch (error) {
    // console.log(error);
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book,
    };
    if (hasError) params.errorMessage = "Error creating Book";
    res.render("books/newBook", params);
  } catch (err) {
    console.log(error);
    res.redirect("/books");
  }
}

function saveCover(book, encodedCover) {
  if (encodedCover) {
    const cover = JSON.parse(encodedCover);
    if (cover && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, "base64");
      book.coverImageType = cover.type;
    }
  }
}

module.exports = router;
