var express = require("express");
var router = express.Router();
var fractal = require("fractal-transformer")();

const model = require("../models/index");
// GET posts listing.
router.get("/", async function (req, res, next) {
  try {
    const posts = await model.posts.findAll({
      include: [model.users],
    });

    //transform data
    var dataTransformed = fractal(posts, {
      post_id: "id",
      title: "title",
      writer: "writer",
      body: "body",
      created_at: "createdAt",
      user: {
        user_id: "user.id",
        name: "user.name",
      },
    });

    if (posts.length !== 0) {
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
//FIND USER
router.get("/:id", async function (req, res, next) {
  try {
    const postsId = req.params.id;
    const posts = await model.posts.findOne({
      where: {
        id: postsId,
      },
    });
    if (posts.length !== 0) {
      res.json({
        status: "OK",
        messages: "",
        data: posts,
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

module.exports = router;
