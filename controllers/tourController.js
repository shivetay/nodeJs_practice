const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: "SUCCESS",
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err,
    });
  }
};

exports.singleTours = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "SUCCESS",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err,
    });
  }
  // const id = +req.params.id;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: "SUCCESS",
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save()
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "SUCCESS",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return new documnet
    });
    res.status(201).json({
      status: "SUCCESS",
      data: {
        tour,
        runValidators: true,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "SUCCESS",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err,
    });
  }
};
