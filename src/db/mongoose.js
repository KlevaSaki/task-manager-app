const mongoose = require("mongoose");
const mongodbURL = process.env.MONGODB_URL;

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
