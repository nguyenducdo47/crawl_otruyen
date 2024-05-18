const mongoose = require("mongoose");

const viewSchema = mongoose.Schema(
  {
    comic_slug: String,
    type: String,
    daily_views: { type: Number, default: 0 },
    weekly_views: { type: Number, default: 0 },
    monthly_views: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  }
);

const viewModel = mongoose.model("view", viewSchema);

module.exports = {
  viewModel,
};
