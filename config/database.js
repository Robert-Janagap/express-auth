const mongoose = require("mongoose");

// database keys
const db = require("./keys").mongoURI;

// connect to database
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected", db))
  .catch(err => console.log(err));
