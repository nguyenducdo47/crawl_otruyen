const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: String,
    slug: String,
  },
  {
    versionKey: false,
  }
);

const categoryModel = mongoose.model('category', categorySchema);

module.exports = {
  categoryModel,
};
