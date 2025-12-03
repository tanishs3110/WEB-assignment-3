const mongoose = require("mongoose");

module.exports = function connectMongo() {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB error:", err));
};
