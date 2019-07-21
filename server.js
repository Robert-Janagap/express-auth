const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const app = express();

// api endpoints documentation
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// database
require("./config/database");

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

// api endpoints routes
const users = require("./routes/api/users");

// api endpoints
let API_V1 = "/api/v1";
app.use(`${API_V1}/users`, users);

const port = process.env.PORT || process.env.PORT_HOST;

app.listen(port, () => console.log(`Server running on port: ${port}`));

module.exports = app;
