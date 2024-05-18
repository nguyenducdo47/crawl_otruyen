const { comicModel } = require("../schemas/comic.schema");
const { categoryModel } = require("../schemas/category.schema");
const { analysisModel } = require("../schemas/analysis.schema");
const { chapterModel } = require("../schemas/chapter.schema");
const { viewModel } = require("../schemas/view.schema");

module.exports = {
  comicModel,
  categoryModel,
  analysisModel,
  chapterModel,
  viewModel,
};
