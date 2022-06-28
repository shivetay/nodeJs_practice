const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is requierd"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 3.5,
  },
  price: {
    type: Number,
    requierd: [true, "Price is requierd"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
