const Tour = require("../models/tourModel");

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(404)
      .json({ message: `no body or price`, status: " FAILED" });
  }
  next();
};

exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: "SUCCESS",
  //   data: {
  //     tours,
  //   },
  // });
};

exports.singleTours = (req, res) => {
  // const id = +req.params.id;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: "SUCCESS",
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = (req, res) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = { id: newId, ...req.body };
  // tours.push(newTour);
};
