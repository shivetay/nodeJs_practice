const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schmea(
  {
    review: { type: String, required: [true, "can't be empty"] },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },

    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "must have tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "must have author"],
      },
    ],
  },
  //virtual properties
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.post("save", function (next) {
  this.populate({
    path: "user",
    select: "-_v -passwordChangedAt",
  });

  this.populate({
    path: "tour",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.export = Review;
