const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(req.body._id);

  res.status(201).json({
    status: "SUCCESS",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please prowide password or email", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("wrong email or password", 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: "SUCCESS",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("no token"), 401);
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decode.id);

  if (!freshUser) {
    return next(new AppError("user not exist", 401));
  }

  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(new AppError("password changed, logi in again", 401));
  }

  req.user = freshUser;

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //req.user is avalible from protect
    if (!roles.includes(req.user.role)) {
      return new AppError("no premmision", 403);
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return new AppError("no user", 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `forgot password? use link below ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "paswowrd reset",
      message,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "token send",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Error sending email", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new AppError("invalid token", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(req.body._id);

  res.status(201).json({
    status: "SUCCESS",
    token,
  });
});
