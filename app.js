const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const userRouter = require("./routes/userRoutes");
const newsRouter = require("./routes/newsRoutes");
const { AppError, errorHandler } = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/news", newsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
