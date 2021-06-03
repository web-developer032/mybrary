const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const fs = require("fs");

// for handling file
const multer = require("multer"); // package that handle files
const path = require("path"); // to make path
const uploadPath = path.join("public", Book.coverImageBasePath); // making path
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]; // declaring which files we accept

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    console.log(file.mimetype);
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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
router.post(
  "/",
  upload.single("coverImage"), // this should be same as the input field name
  async (req, res) => {
    const filename = req.file?.filename || null;
    console.log("File: ", req.file);
    console.log("FileName: ", filename);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description,
      // coverImageName: filename,
      coverImageName: filename,
    });

    try {
      const newBook = await book.save();
      // res.redirect(`/books/${newBook.id}`);
      res.redirect("/books");
    } catch (error) {
      // console.log(error);
      if (book.coverImageName) removeBookCover(book.coverImageName);
      renderNewPage(res, book, true);
    }
  }
);

function removeBookCover(filename) {
  fs.unlink(path.join(uploadPath, filename), (err) => {
    if (err) console.log(err);
  });
}

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

module.exports = router;
