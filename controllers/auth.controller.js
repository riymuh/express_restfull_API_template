const db = require("../models");
const config = require("../config/auth.config");
var fractal = require("fractal-transformer")();
var usersTransformer = require("../transformers/user.transformer");
const User = db.users;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async function (req, res, next) {
  // Save User to Database
  try {
    const users = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    var dataTransformed = fractal(users, usersTransformer);

    res.json({
      status: "OK",
      messages: "",
      data: dataTransformed,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async function (req, res, next) {
  try {
    const users = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!users) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, users.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: users.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    var dataTransformed = fractal(users, usersTransformer);

    res.json({
      status: "OK",
      messages: "",
      accessToken: token,
      data: dataTransformed,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
