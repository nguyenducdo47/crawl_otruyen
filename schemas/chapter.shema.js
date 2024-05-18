const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema(
  {
    name: String,
    comic_slug: { type: String, index: true },
    title: String,
    path: String,
    totalImage: Number,
  },
  {
    versionKey: false,
  }
);

const chapterModel = mongoose.model('chapter', chapterSchema);

module.exports = {
  chapterModel,
};
