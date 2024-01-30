const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Please input news url"],
    unique: true,
  },
  hackerNewsUrl: {
    type: String,
    default: "https://news.ycombinator.com/",
  },
  postedOn: {
    type: Date,
    required: [true, "Please input the posted time"],
  },
  upvotes: {
    type: Number,
    required: [true, "Please input number of upvotes"],
  },
  comments: {
    type: Number,
    required: [true, "Please input number of comments"],
  },
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
