var express = require("express");
var router = express.Router();
var fractal = require("fractal-transformer")();

const model = require("../models/index");
// GET users listing.
router.get("/", async function (req, res, next) {
  try {
    const users = await model.users.findAll({
      include: [model.posts],
    });
    if (users.length !== 0) {
      //transform data
      var dataTransformed = fractal(users, {
        user_id: "id",
        name: "name",
        email: "email",
        phone_number: "phone_number",
        gender: "gender",
      });

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
    const { name, email, gender, phoneNumber } = req.body;
    const users = await model.users.create({
      name,
      email,
      gender,
      phone_number: phoneNumber,
    });
    if (users) {
      res.status(201).json({
        status: "OK",
        messages: "User berhasil ditambahkan",
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
      var dataTransformed = fractal(users, {
        user_id: "id",
        name: "name",
        email: "email",
        phone_number: "phone_number",
        gender: function (data) {
          return data.get("gender") ? true : false;
        },
        posts:
          Object.keys(users.posts).length > 0
            ? fractal(users.posts, {
                post_id: "id",
                title: "title",
              })
            : [],
      });

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
    const { name, email, gender, phoneNumber } = req.body;
    const users = await model.users.update(
      {
        name,
        email,
        gender,
        phone_number: phoneNumber,
      },
      {
        where: {
          id: usersId,
        },
      }
    );
    if (users) {
      res.json({
        status: "OK",
        messages: "User berhasil diupdate",
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
