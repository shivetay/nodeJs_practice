const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is requierd"],
    unique: true,
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
  },
  startDates: [Date],
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
