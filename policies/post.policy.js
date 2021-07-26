const db = require("../models");
const Post = db.posts;

verifyPostByUserId = async function (req, res, next) {
  let userId = req.userId;
  let postId = req.params.id;

  const posts = await Post.findOne({
    where: {
      id: postId,
    },
  });

  if (posts.userId != userId) {
    return res.status(403).send({
      message: "You cannot acces this post",
    });
  }
  next();
};

const postPolicy = {
  verifyPostByUserId: verifyPostByUserId,
};
module.exports = postPolicy;
