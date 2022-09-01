const express = require("express");
const reviewController = require("../controllers/reviwController");
const authController = require("../controllers/authController");

//grant access from tourRouter with tourId
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = router;
