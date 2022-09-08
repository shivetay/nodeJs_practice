const multer = require("multer");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// * multer init
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  },
}); // * saves to disk

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("not an image", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single("photo"); // *! "photo" => name of input field

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.allUsers = (req, res) => {
  res.status(500).json({
    status: "ERROR",
    message: "Not implemented",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "ERROR",
    message: "Not implemented",
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "ERROR",
    message: "Not implemented",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "ERROR",
    message: "Not implemented",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "ERROR",
    message: "Not implemented",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  if (req.file) filteredBody.photo = req.file;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findById(req.user.id, { active: false });

  res.status(205).json({
    status: "success",
    data: null,
  });
});
