const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requierd"],
      unique: true,
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      requierd: [true, "Need duration"],
    },
    maxGroupSize: {
      type: Number,
      requierd: [true, "Nedd max group number"],
    },
    difficulty: {
      type: String,
      requierd: [true, "requierd"],
    },
    ratingAverage: {
      type: Number,
      default: 3.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      requierd: [true, "Price is requierd"],
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: { type: String, trim: true },
    imageCover: { type: String, requierd: [true, "need img"] },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//document middleware: runs before .save() .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre("save", function (next) {
//   console.log("save");
//   next();
// });

// tourSchema.post("save", (doc, next) => {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
