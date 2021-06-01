if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const indexRouter = require("./routes/indexRoute");
const authorRouter = require("./routes/authorRoute");

const app = express();
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("DATABASE Connection Successfull"));

// parse application/json
// parse application/json, basically parse incoming Request Object as a JSON Object
app.use(express.json());

// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// parse application/x-www-form-urlencoded
// combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
//app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);

// Routes
app.use("/", indexRouter);
app.use("/authors", authorRouter);

app.listen(process.env.PORT || 4000, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", process.env.PORT || 4000);
});
