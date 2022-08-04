const express = require("express");

const tourController = require("../controllers/tourController");

const router = express.Router();
const authController = require("../controllers/authController");

// router.param("id", tourController.checkId);

//alias route
router.route("/top-5").get(tourController.topTours, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getTourStats);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router.route("/:id").get(tourController.singleTours);

module.exports = router;
