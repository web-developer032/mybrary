const express = require("express");
const router = express.Router();
const Author = require("../models/authorModel");
const Book = require("../models/bookModel");

// All Authors
router.get("/", async (req, res) => {
  const searchOptions = {};
  if (req.query.name) {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/indexAuthor", { authors, searchOptions: req.query });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// New Authors
router.get("/new", (req, res) => {
  res.render("authors/newAuthor", { author: new Author() });
});

// All Authors
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name.trim(),
  });

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${author.id}`);
  } catch {
    res.render("authors/newAuthor", {
      author,
      errorMessage: "Error Creating Author",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    res.render("authors/showAuthors", { author, booksByAuthor: books });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/editAuthor", { author });

    console.log(author);
  } catch (error) {
    console.log(error);
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author) {
      res.render(`authors/editAuthor`, {
        author,
        errorMessage: "Error Updating Author",
      });
    } else {
      res.redirect("/");
    }
  }
});

router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch (error) {
    console.log(error);
    if (author) {
      res.redirect(`/authors/${author.id}`);
    } else {
      res.redirect("/");
    }
  }
});

module.exports = router;
