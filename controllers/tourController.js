const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactoryController");

exports.topTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-price";
  req.query.fields = "name, price, summary";

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const tours = await features.query;
  res.status(200).json({
    status: "SUCCESS",
    data: {
      tours,
    },
  });
  // try {
  //   const features = new APIFeatures(Tour.find(), req.query)
  //     .filter()
  //     .sort()
  //     .limit()
  //     .pagination();

  //   const tours = await features.query;
  //   res.status(200).json({
  //     status: "SUCCESS",
  //     data: {
  //       tours,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "FAILED",
  //     message: err,
  //   });
  // }
});

exports.singleTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id); //populate moved to query middleware

  if (!tour) {
    return next(new AppError("no tour with id", 404));
  }
  res.status(200).json({
    status: "SUCCESS",
    data: {
      tour,
    },
  });
  // try {
  //   const tour = await Tour.findById(req.params.id);
  //   res.status(200).json({
  //     status: "SUCCESS",
  //     data: {
  //       tour,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "FAILED",
  //     message: err,
  //   });
  // }
  // const id = +req.params.id;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: "SUCCESS",
  //   data: {
  //     tour,
  //   },
  // });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({})
  // newTour.save()

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "SUCCESS",
    data: {
      tour: newTour,
    },
  });
  // try {
  //   const newTour = await Tour.create(req.body);

  //   res.status(201).json({
  //     status: "SUCCESS",
  //     data: {
  //       tour: newTour,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "FAILED",
  //     message: err,
  //   });
  // }
});

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

// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: "SUCCESS",
//       data: null,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "FAILED",
//       message: err,
//     });
//   }
// };

//delete moved to factory
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: "$difficulty",
          numRaitings: { $sum: "$ratingsQuantity" },
          numTours: { $sum: 1 },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    console.log(stats);

    res.status(200).json({
      status: "SUCCESS",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "FAILED",
      message: err,
    });
  }
};
