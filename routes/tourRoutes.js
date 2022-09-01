const express = require("express");

const tourController = require("../controllers/tourController");

const router = express.Router();
const authController = require("../controllers/authController");
// const reviewController = require("../controllers/reviwController");
const reviewRouter = require("./reviewRoutes");

// router.param("id", tourController.checkId);

router.use("/:tourId/review", reviewRouter);

//alias route
router.route("/top-5").get(tourController.topTours, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour)
  .delete(authController.protect, authController.restrictTo("admin"));
router.route("/:id").get(tourController.singleTours);

// router
//   .route("/:tourId/review")
//   .post(
//     authController.protect,
//     authController.restrictTo("user"),
//     reviewController.createReview
//   );

module.exports = router;
