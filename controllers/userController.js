const User = require("../models/userModel");
const { catchAsyncError, AppError } = require("../controllers/errorController");
const _ = require("lodash");

exports.signup = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username });
  if (user)
    return next(new AppError("This username has already been registered", 400));

  user = await User.create({
    username,
    password,
  });
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .status(201)
    .json({
      status: "success",
      user: _.pick(user, ["_id", "username"]),
    });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return next(new AppError("Incorrect username or password", 400));

  if ((await user.verifyPassword(password, user.password)) === false)
    return next(new AppError("Incorrect username or password", 400));

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .status(200)
    .json({
      status: "success",
      user: _.pick(user, ["_id", "username"]),
    });
});
