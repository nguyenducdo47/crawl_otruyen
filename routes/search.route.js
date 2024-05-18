const { ITEMS_PER_PAGE } = require('../constants');
const { comicModel, categoryModel } = require('../schemas');
const { formatCategory } = require('../utils/format-category');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const q = req.query.q;
    if (!q) throw new Error('Query string is required!');
    const [comics, categories, totalItems] = await Promise.all([
      comicModel
        .find({
          $or: [
            { slug: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
          ],
        })
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort({ updatedAt: -1 }),
      categoryModel.find(),
      comicModel
        .find({
          $or: [
            { slug: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
          ],
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

module.exports = router;
