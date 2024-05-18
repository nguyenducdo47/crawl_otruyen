require('dotenv').config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const OTRUYEN_BASE_URL = process.env.OTRUYEN_BASE_URL;
const DOMAIN = process.env.DOMAIN;
const PAGE = process.env.PAGE;
const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE || 25;
const OTRUYEN_IMAGE_BASE_URL = process.env.OTRUYEN_IMAGE_BASE_URL;

module.exports = {
  PORT,
  MONGO_URI,
  OTRUYEN_BASE_URL,
  DOMAIN,
  PAGE,
  ITEMS_PER_PAGE,
  OTRUYEN_IMAGE_BASE_URL,
};
