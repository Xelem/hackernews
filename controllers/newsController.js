const { catchAsyncError, AppError } = require("./errorController");
const axios = require("axios");
const News = require("../models/newsModel");
const User = require("../models/userModel");

exports.dashboard = catchAsyncError(async (req, res) => {
  const { data } = await axios({
    method: "GET",
    url: "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty",
  });

  const firstThreePages = data.slice(0, 91);
  firstThreePages.map(async (newsItem) => {
    const { data } = await axios({
      method: "GET",
      url: `https://hacker-news.firebaseio.com/v0/item/${newsItem}.json?print=pretty`,
    });

    const news = await News.findOne({ url: data.url });
    if (news) {
      (news.upvotes = data.score), (news.comments = data.descendants);

      news.save();
    } else if (data.url) {
      await News.create({
        url: data.url,
        postedOn: data.time * 1000,
        upvotes: data.score,
        comments: data.descendants,
      });
    }
  });

  const allNews = await News.find();
  const user = await User.findById(req.user._id);
  let filteredArray = [];

  if (user.deletedItems) {
    const newArr = user.deletedItems.map((item) => item.toString());
    filteredArray = allNews.filter(
      (item) => !newArr.includes(item._id.toString())
    );

    console.log(allNews.length);
    console.log(filteredArray.length);
  }

  res.send(filteredArray);
});

exports.update = catchAsyncError(async (req, res, next) => {
  const news = await News.findById(req.params.id);
  if (!news) return next(new AppError("No news with that id found"));

  const user = await User.findById(req.user._id);

  if (req.body.isRead === true) {
    user.readItems.push(req.params.id);
  }
  if (req.body.isDeleted === true) {
    user.deletedItems.push(req.params.id);
  }
  user.save();

  res.send(news);
});
