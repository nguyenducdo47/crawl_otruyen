const mongoose = require("mongoose");

const comicSchema = mongoose.Schema(
  {
    name: String,
    slug: { type: String, index: true },
    origin_name: [{ type: String }],
    content: String,
    status: String,
    thumb_url: String,
    author: [{ type: String }],
    category: [{ type: String }], // only category_id
    updatedAt: Date,
    total_views: { type: Number, default: 0 },
    favourite: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  }
);

const comicModel = mongoose.model("comic", comicSchema);

module.exports = {
  comicModel,
};
