var express = require("express");
var router = express.Router();
var fractal = require("fractal-transformer")();
var usersTransformer = require("../transformers/users");

const model = require("../models/index");
// GET users listing.
router.get("/", async function (req, res, next) {
  try {
    const users = await model.users.findAll({
      include: [model.posts],
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
      var dataTransformed = fractal(users, usersTransformer);

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
});
// POST users
router.post("/", async function (req, res, next) {
  try {
    const { name, email, gender, phone_number } = req.body;
    const users = await model.users.create({
      name,
      email,
      gender,
      phone_number,
    });

    var dataTransformed = fractal(users, usersTransformer);
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
});

//FIND USER
router.get("/:id", async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const users = await model.users.findOne({
      include: [model.posts],
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

      var dataTransformed = fractal(users, usersTransformer);

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
});

// UPDATE users
router.patch("/:id", async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const { name, email, gender, phone_number } = req.body;
    const users = await model.users.update(
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

    const users_update = await model.users.findOne({
      include: [model.posts],
      where: {
        id: usersId,
      },
    });

    var dataTransformed = fractal(users_update, usersTransformer);
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
});
// DELETE users
router.delete("/:id", async function (req, res, next) {
  try {
    const usersId = req.params.id;
    const users = await model.users.destroy({
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
});

module.exports = router;
