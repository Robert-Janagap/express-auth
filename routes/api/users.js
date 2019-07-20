const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
// models
const Users = require("../../models/Users");

// validation
const validateRegisterInput = require("../../util/validation/register");
const validateLoginInput = require("../../util/validation/login");

// @route  /users/register
// @desc   register new user
// @access public
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  try {
    const user = await Users.findOne({ email });
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pr", // rating
        d: "mm" // default
      });

      const { name, email, role, password } = req.body;
      const newUser = new Users({
        name,
        email,
        role,
        password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          const user = await newUser.save();
          return res.json(user);
        });
      });
    }
  } catch (err) {
    res.json(err);
  }
});

// @route  /users/login
// @desc   login user
// @access public
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if (!user) {
    errors.email = "User not found";
    return res.status(404).json(errors);
  }

  try {
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: "7d" },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        res.status(404).json(errors);
      }
    });
  } catch (error) {
    res.json(error);
  }
});

// @route  /users
// @desc   get user
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id, name, email } = req.user;
      res.json({
        id,
        name,
        email
      });
    } catch (error) {
      res.json(error);
    }
  }
);

module.exports = router;
