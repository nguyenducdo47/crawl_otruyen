const mongoose = require('mongoose');
const { PAGE } = require('../constants');

const analysisSchema = mongoose.Schema(
  {
    provider: {
      type: String,
      default: 'O_TRUYEN',
    },
    totalPage: {
      type: Number,
      default: PAGE,
    },
    currentPage: {
      type: Number,
      default: PAGE,
    },
    totalItem: {
      type: Number,
      default: 0,
    },
    currentItem: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

const analysisModel = mongoose.model('analysis', analysisSchema);

module.exports = {
  analysisModel,
};
