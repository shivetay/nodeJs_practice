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
    //child refrerencing
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

//populate revews with user and tours change id to user/tour data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  // this.populate({
  //   path: "tour",
  //   select: "name",
  // });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.export = Review;
