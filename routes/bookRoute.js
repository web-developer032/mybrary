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

// New Book
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Add Book
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
    res.redirect(`/books/${newBook.id}`);
  } catch (error) {
    renderNewPage(res, book, true);
  }
});
async function renderNewPage(res, book, hasError = false) {
  renderFormPage(res, book, "newBook", hasError);
}

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/showBook", { book });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  } catch (error) {
    console.log(error);

    res.redirect("/");
  }
});

// update Book
router.put("/:id", async (req, res) => {
  let book;

  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = new Date(req.body.publishDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;

    if (req.body.cover?.trim()) {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    if (book) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "editBook", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book,
    };
    if (hasError)
      if (form === "edit") params.errorMessage = "Error Editing Book";
      else params.errorMessage = "Error Creating Book";
    res.render(`books/${form}`, params);
  } catch (err) {
    console.log(err);
    res.redirect("/books");
  }
}

// delete book
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect("/books");
  } catch (error) {
    if (book) {
      res.render("books/showBook", {
        book,
        errorMessage: "Couldn't remove book",
      });
    } else {
      res.redirect("/");
    }
  }
});

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
