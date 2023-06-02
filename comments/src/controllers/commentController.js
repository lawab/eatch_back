const { fieldsRequired } = require("../models/comment/comment");
const { fieldsValidator } = require("../models/comment/validators");
const commentServices = require("../services/commentServices");
const { default: mongoose } = require("mongoose");
// create one comment in database
const createComment = async (req, res) => {
  try {
    let body = req.body;

    // verify fields on body
    let { validate } = fieldsValidator(Object.keys(body), fieldsRequired);

    // if body have invalid fields
    if (!validate) {
      return res.status(401).json({ message: "invalid data!!!" });
    }

    // get client since microservice clients
    let client = await commentServices.getClient(body?.client, req.token);

    console.log({ client });

    // if client not exists in database
    if (!client?._id) {
      body["client"] = {
        _id: mongoose.Types.ObjectId(), // generate random _id for client
      };
    }

    if (client?._id) {
      // update client field with client find in database
      body["client"] = client;
    }

    let comment = await commentServices.createComment(body);

    console.log({ commentCreated: comment?._id }, "*");

    if (comment?._id) {
      res
        .status(200)
        .json({ message: "Comment has been created successfully!!!" });
    } else {
      res
        .status(401)
        .json({ message: "Comment has been not created successfully!!!" });
    }
  } catch (error) {
    console.log(error, "x");
    return res
      .status(500)
      .json({ message: "Error occured during a creation of comment!!!" });
  }
};
// update comment in database
const updateComment = async (req, res) => {
  try {
    // get the auathor to update comment
    const { validate } = fieldsValidator(Object.keys(req.body), fieldsRequired);

    if (!validate) {
      return res.status(401).json({
        message: "invalid data send!!!",
      });
    }

    let client = await commentServices.getClient(req.body?.client, req.token);

    if (!client?._id) {
      return res.status(401).json({
        message: "unable to update this comment because client not exists!!!",
      });
    }

    let comment = await commentServices.findComment({
      _id: req.params?.id,
    });

    if (!comment?._id) {
      return res.status(401).json({
        message: "unable to update comment because it not exists!!!",
      });
    }

    comment["message"] = req.body?.message ?? comment["message"]; // Update message with new content or old content
    comment["client"] = client; // Update new client

    let commentUpdated = await comment.save({ validateModifiedOnly: true });

    console.log(
      { commentUpdated, client, message: commentUpdated?.message },
      "*"
    );

    if (commentUpdated?._id) {
      res
        .status(200)
        .json({ message: "Comment has been updated successfully!!" });
    } else {
      res.status(401).json({
        message: "Comment has been not updated successfully!!",
      });
    }
  } catch (error) {
    console.log(error, "x");
    res.status(500).json({
      message: "Erros occured during the update comment!!!",
    });
  }
};
// delete one comment in database
const deleteComment = async (req, res) => {
  try {
    // get the auathor to delete comment
    let client = await commentServices.getClient(req.body?.client, req.token);
    if (!client?._id) {
      return res.status(401).json({
        message: "unable to delete comment because author not exists!!!",
      });
    }

    // find and delete comment
    let commentDeleted = await commentServices.deleteOne(
      {
        _id: req.params?.id,
        deletedAt: null,
      },
      { deletedAt: Date.now(), client } //set date of deletion and client who delete comment,no drop comment
    );

    // if comment not exits or had already deleted
    if (!commentDeleted?._id) {
      return res.status(401).json({
        message:
          "unable to delete a comment because it not exists or already be deleted!!!",
      });
    }
    // comment exits and had deleted successfully
    if (commentDeleted?.deletedAt) {
      console.log({ commentDeleted });
      return res
        .status(200)
        .json({ message: "comment has been deleted sucessfully" });
    } else {
      return res.status(500).json({ message: "deletion of comment failed" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error(s) occured during the deletion of comment!!!" });
  }
};
// get one comment in database
const fetchComment = async (req, res) => {
  try {
    let comment = await commentServices.findComment({
      _id: req.params?.id,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};
// get comments in database
const fetchComments = async (_, res) => {
  try {
    let comments = await commentServices.findComments();
    res.status(200).json(comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

// fetch comments by restaurant in database
const fetchCommentsByRestaurant = async (req, res) => {
  try {
    let comments = await commentServices.findComments({
      "restaurant._id": req.params?.id,
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error occured during get request!!!" });
  }
};

module.exports = {
  createComment,
  deleteComment,
  fetchComments,
  updateComment,
  fetchComment,
  fetchCommentsByRestaurant,
};
