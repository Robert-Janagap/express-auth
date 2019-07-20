const env = process.env.NODE_ENV;

if (env === "test") {
  module.exports = {
    mongoURI: "mongodb://localhost:27017/test",
    secretOrKey: "pizzaboy"
  };
} else {
  module.exports = {
    mongoURI:
      "mongodb+srv://robert:developer@bioncluster0-gelzy.mongodb.net/test?retryWrites=true&w=majority",
    secretOrKey: "pizzaboy"
  };
}
