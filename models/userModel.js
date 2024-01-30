const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minLength: [5, "Username cannot be less than 5 characters"],
  },
  password: {
    type: String,
    minLength: [8, "password cannot be less than 8 characters"],
  },
  readItems: [
    {
      type: mongoose.Schema.ObjectId,
      default: [],
    },
  ],
  deletedItems: [
    {
      type: mongoose.Schema.ObjectId,
      default: [],
    },
  ],
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

userSchema.methods.verifyPassword = async function (
  currentPassword,
  currentHash
) {
  return await bcrypt.compare(currentPassword, currentHash);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
