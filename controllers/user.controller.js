const db = require("../models");
const config = require("../config/auth.config");
var fractal = require("fractal-transformer")();
var { userTransformer } = require("../transformers/");
const User = db.users;
const Op = db.Sequelize.Op;

exports.getUsers = async function (req, res, next) {
  try {
    const users = await User.findAll({
      include: [db.posts],
    });
    if (users.length !== 0) {
      //transform data
      // var dataTransformed = fractal(users, {
      //   user_id: "id",
      //   name: "name",
      //   email: "email",
      //   phone_number: "phone_number",
      //   gender: "gender",
      //   posts: function (data) {
      //     return data.get("posts").length > 0
      //       ? fractal(data.get("posts"), {
      //           post_id: "id",
      //           title: "title",
      //         })
      //       : [];
      //   },
      // });
      var dataTransformed = fractal(users, userTransformer);

      res.json({
        status: "OK",
        messages: "",
        data: dataTransformed,
      });
    } else {
      res.json({
        status: "ERROR",
        messages: "EMPTY",
        data: {},
      });
    }
  } catch (err) {
    res.json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
};

exports.createUser = async function (req, res, next) {
  try {
    const { name, email, gender, phone_number } = req.body;
    const users = await User.create({
      name,
      email,
      gender,
      phone_number,
    });

    var dataTransformed = fractal(users, userTransformer);
    if (users) {
      res.status(201).json({
        status: "OK",
        messages: "User berhasil ditambahkan",
        data: dataTransformed,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
};

exports.getUser = async function (req, res, next) {
  try {
    //get from auth jwt middleware
    //let userIdLoggedIn = req.userId;
    let userIdLoggedIn = 1;

    const usersId = req.params.id;
    const users = await User.findOne({
      include: [db.posts],
      where: {
        id: usersId,
      },
    });
    if (users.length !== 0) {
      // var dataTransformed = fractal(users, {
      //   user_id: "id",
      //   name: "name",
      //   email: "email",
      //   phone_number: "phone_number",
      //   gender: function (data) {
      //     return data.get("gender") ? true : false;
      //   },
      //   posts:
      //     Object.keys(users.posts).length > 0
      //       ? fractal(users.posts, {
      //           post_id: "id",
      //           title: "title",
      //         })
      //       : [],
      // });

      var dataTransformed = fractal(users, userTransformer);

      res.json({
        status: "OK",
        messages: "",
        userIdLoggedIn: userIdLoggedIn,
        data: dataTransformed,
      });
    } else {
      res.json({
        status: "ERROR",
        messages: "EMPTY",
        data: {},
      });
    }
  } catch (err) {
    res.json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const { name, email, gender, phone_number } = req.body;
    const users = await User.update(
      {
        name,
        email,
        gender,
        phone_number,
      },
      {
        where: {
          id: usersId,
        },
      }
    );

    const users_update = await User.findOne({
      include: [db.posts],
      where: {
        id: usersId,
      },
    });

    var dataTransformed = fractal(users_update, userTransformer);
    if (users) {
      res.json({
        status: "OK",
        messages: "User berhasil diupdate",
        data: dataTransformed,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
};

exports.deleteUser = async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const users = await User.destroy({
      where: {
        id: usersId,
      },
    });
    if (users) {
      res.json({
        status: "OK",
        messages: "User berhasil dihapus",
        data: users,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      messages: err.message,
      data: {},
    });
  }
};
