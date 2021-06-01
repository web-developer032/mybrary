const express = require("express");
const router = express.Router();
const Author = require("../models/authorModel");

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
    // res.redirect(`authors/${author.id}`);
    res.redirect("authors");
  } catch {
    res.render("authors/newAuthor", {
      author,
      errorMessage: "Error Creating Author",
    });
  }
});

module.exports = router;
