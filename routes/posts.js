var express = require("express");
var router = express.Router();

const model = require("../models/index");
// GET posts listing.
router.get("/", async function (req, res, next) {
  try {
    const posts = await model.posts.findAll({
      include: [model.users],
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
