const { fetch, Agent } = require('undici');
const { OTRUYEN_BASE_URL, ITEMS_PER_PAGE } = require('../constants');
const { categoryModel, comicModel } = require('../schemas');
const { formatCategory } = require('../utils/format-category');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const categories = [];
    const allCategory = await categoryModel.find();
    allCategory.forEach((category) => {
      categories.some((cate) => cate.slug === category.slug)
        ? undefined
        : categories.push(category);
    });
    res.json(categories);
  } catch (err) {
    throw new Error(err);
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const savedCategory = await categoryModel.findOne({
      slug: req.params.slug,
    });
    if (!savedCategory) {
      return res.status(404).json({
        status: 404,
        msg: 'Not found',
      });
    }
    const [comics, categories, totalItems] = await Promise.all([
      comicModel
        .find({
          category: { $in: [savedCategory._id.toString()] },
        })
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ updatedAt: -1 }),
      categoryModel.find(),
      comicModel
        .find({
          category: { $in: [savedCategory._id.toString()] },
        })
        .countDocuments(),
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

router.post('/', async (req, res) => {
  try {
    const response = await fetch(OTRUYEN_BASE_URL + '/the-loai', {
      dispatcher: new Agent({ connectTimeout: 60e3 }),
    });
    const data = await response.json();
    data.data.items.forEach(async (item) => {
      const category = await categoryModel.findOne({
        slug: item.slug,
      });
      if (!category) {
        new categoryModel({
          name: item.name,
          slug: item.slug,
        }).save();
      }
    });
    res.json({
      updated: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
