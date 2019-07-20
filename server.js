const express = require("express");
require("dotenv").config();
// database
require("./config/database");

const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const app = express();

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// passport
require("./config/passport")(passport);

// static assets for production
if (process.env.NODE_ENV === "production") {
  // static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// api
const users = require("./routes/api/users");

// urls
app.use("/users", users);

const port = process.env.PORT || process.env.PORT_HOST;

app.listen(port, () => console.log(`Server running on port: ${port}`));

module.exports = app;
