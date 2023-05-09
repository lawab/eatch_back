const express = require("express");
const {
  createComment,
  deleteComment,
  fetchComment,
  updateComment,
  fetchComments,
  fetchCommentsByRestaurant,
} = require("../controllers/commentController");
const uploadFileService = require("../services/uploadFile");
const { authmiddleware } = require("../middlewares/authmiddleware");
var commentRouter = express.Router();
const upload = uploadFileService.uploadMiddleFile();

//Create comment
commentRouter.post(
  "/create",
  authmiddleware,
  upload.single("file"),
  createComment
);

//delete comment
commentRouter.delete("/delete/:id", authmiddleware, deleteComment);

//get comment
commentRouter.get("/fetch/one/:id", authmiddleware, fetchComment);

//get comments
commentRouter.get(
  ["/fetch/all", "/fetch/all/:ids"],
  authmiddleware,
  fetchComments
);

//get comments by restaurant
commentRouter.get(
  "/fetch/restaurant/:id",
  authmiddleware,
  fetchCommentsByRestaurant
);

//update comment
commentRouter.put(
  "/update/:id",
  authmiddleware,
  upload.single("file"),
  updateComment
);

//Export route to be used on another place
module.exports = commentRouter;
