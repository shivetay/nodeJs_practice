const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is requierd"],
    unique: true,
  },

  email: {
    type: String,
    require: [true, "Email is requierd"],
    unique: true,
    //transform to lower case
    lowercase: true,
    validate: [validator.isEmail, "Not valid email"],
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    require: [true, "Password is requierd"],
    unique: true,
    // minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    // require: [true, "Name is requierd"],
    require: true,
    validate: {
      //only works on saev!!
      validator: function (el) {
        return el === this.password;
      },
      message: "password is not the same",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//instance method avalibel on all documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTiem() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
