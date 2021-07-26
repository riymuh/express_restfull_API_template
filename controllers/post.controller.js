const db = require("../models");
const config = require("../config/auth.config");
var fractal = require("fractal-transformer")();
var { postTransformer } = require("../transformers/");
const Post = db.posts;
const Op = db.Sequelize.Op;

exports.getPosts = async function (req, res, next) {
  try {
    const posts = await Post.findAll({
      include: [db.users],
    });

    //transform data
    var dataTransformed = fractal(posts, postTransformer);

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
};

exports.getPost = async function (req, res, next) {
  try {
    const postsId = req.params.id;
    const posts = await Post.findOne({
      where: {
        id: postsId,
      },
    });
    if (posts.length !== 0) {
      //transform data
      var dataTransformed = fractal(posts, postTransformer);

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
