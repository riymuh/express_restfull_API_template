const db = require("../models");
const config = require("../config/auth.config");
var fractal = require("fractal-transformer")();
var usersTransformer = require("../transformers/users");
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
  await User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
