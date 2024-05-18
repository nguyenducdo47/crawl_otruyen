const { OTRUYEN_IMAGE_BASE_URL } = require("../constants");
const { comicModel, categoryModel, chapterModel } = require("../schemas");
const { formatCategory } = require("../utils/format-category");
const router = require("express").Router();
const { updateViews } = require("../controllers/view.controller");

router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const [savedComic, categories, chapters] = await Promise.all([
      comicModel.findOne({ slug }),
      categoryModel.find(),
      chapterModel.find({ comic_slug: slug }),
    ]);
    if (savedComic) {
      const { total_views } = await updateViews(slug);
      return await res.json({
        ...savedComic._doc,
        category: formatCategory(savedComic._doc.category, categories),
        chapters,
        total_views,
      });
    }
    res.status(404).json({
      status: 404,
      msg: "Not found",
    });
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/:slug/:name", async (req, res) => {
  try {
    const { slug, name } = req.params || {};
    const [savedComic, chapter, chapters] = await Promise.all([
      comicModel.findOne({ slug }),
      chapterModel.findOne({ comic_slug: slug, name }),
      chapterModel.find({ comic_slug: slug }),
    ]);
    if (!savedComic || !chapter) {
      return res.status(404).json({
        status: 404,
        msg: "Not found",
      });
    }
    res.json({
      ...savedComic._doc,
      images: new Array(chapter.totalImage).fill(".").map((_, idx) => ({
        page: idx + 1,
        src: `${OTRUYEN_IMAGE_BASE_URL + chapter.path}/page_${idx + 1}.jpg`,
      })),
      chapters,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
