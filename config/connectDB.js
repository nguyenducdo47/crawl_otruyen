const mongoose = require('mongoose');
const { MONGO_URI } = require('../constants');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  connectDB,
};
