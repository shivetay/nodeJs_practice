const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requierd"],
      unique: true,
      maxlength: [40, "A tour name must have less or equal 40"],
      minlength: [10, "need min 10"],
      // validator: [validator.isAlpha, "only letters"],
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
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "This is not proper diffculity",
      },
    },
    ratingAverage: {
      type: Number,
      default: 3.5,
      min: [1, " Rating min 1"],
      max: [5, "5 is max"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      requierd: [true, "Price is requierd"],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "discount need to be lower than price",
      },
    },
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
    secretTour: { type: Boolean, default: false },
    startLocation: {
      //GeoJSON
      type: { type: String, default: "Point", enum: ["Point"] },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: "Point", enum: ["Point"] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, //embeding data
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },

  //virtual properties
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingAverage: -1 });

//virtual properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreginField: "tour", //this is from review model
  localField: "_id", //this is from tourmodel
});

//document middleware: runs before .save() .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//embeding data
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre("save", function (next) {
//   console.log("save");
//   next();
// });

// tourSchema.post("save", (doc, next) => {
//   console.log(doc);
//   next();
// });
//query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-_v -passwordChangedAt",
  });
  this.populate({
    path: "reviews",
  });

  next();
});

// eslint-disable-next-line prefer-arrow-callback
tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
