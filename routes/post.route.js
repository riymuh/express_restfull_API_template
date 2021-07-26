var express = require("express");
var router = express.Router();
var { postPolicy } = require("../policies");
const controller = require("../controllers/post.controller");

const model = require("../models/index");
// GET posts listing.
router.get("/", [postPolicy.verifyPostByUserId], controller.getPosts);
//FIND USER
router.get("/:id", [postPolicy.verifyPostByUserId], controller.getPost);

module.exports = router;
