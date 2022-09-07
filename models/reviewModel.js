const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
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

//prev duplicates
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

//static method
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //pass all stages of agregate
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "rating" },
      },
    },
  ]);

  console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.pre("save", function (next) {
  this.constructor.calcAverageRatings(this.tour);

  next();
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.export = Review;
