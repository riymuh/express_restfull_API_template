var express = require("express");
var router = express.Router();
var { postPolicy } = require("../policies");
const controller = require("../controllers/user.controller");

const model = require("../models/index");
// GET users listing.

// POST users
router.get("/", controller.getUsers);
//[postPolicy.verifyPostByUserId]

// POST users
router.post("/", controller.createUser);

//FIND USER
router.get("/:id", controller.getUser);

// UPDATE users
router.patch("/:id", controller.updateUser);

// DELETE users
router.delete("/:id", controller.deleteUser);

module.exports = router;
