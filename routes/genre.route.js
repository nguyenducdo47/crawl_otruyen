const { ITEMS_PER_PAGE } = require('../constants');
const { comicModel, categoryModel } = require('../schemas');
const { formatCategory } = require('../utils/format-category');

const router = require('express').Router();
const paths = [
  { originPath: '/sap-ra-mat', status: 'coming_soon' },
  { originPath: '/dang-phat-hanh', status: 'ongoing' },
  { originPath: '/hoan-thanh', status: 'completed' },
];

router.get('/truyen-moi', async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const [comics, categories, totalItems] = await Promise.all([
      comicModel
        .find()
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ updatedAt: -1 }),
      categoryModel.find(),
      comicModel.find().countDocuments(),
    ]);
    const formattedComics = comics.map((comic) => ({
      ...comic._doc,
      category: formatCategory(comic.category, categories),
    }));
    res.json({
      comics: formattedComics,
      totalItems,
      currentPage,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (err) {
    throw new Error(err);
  }
});

paths.forEach(({ originPath, status }) => {
  router.get(originPath, async (req, res) => {
    try {
      const currentPage = Number(req.query.page || 1);
      const [comics, categories, totalItems] = await Promise.all([
        comicModel
          .find({ status })
          .skip((currentPage - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
          .sort({ updatedAt: -1 }),
        categoryModel.find(),
        comicModel.find({ status }).countDocuments(),
      ]);
      const formattedComics = comics.map((comic) => ({
        ...comic._doc,
        category: formatCategory(comic.category, categories),
      }));
      res.json({
        comics: formattedComics,
        totalItems,
        currentPage,
        totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    } catch (err) {
      throw new Error(err);
    }
  });
});

module.exports = router;
