const {
  updateTotalCrawledItems,
  analysisComic,
} = require('../bot/analysis-bot');
const { autoCrawlComic } = require('../bot/crawl-bot');
const { createComic } = require('../controllers/comic.controller');
const { analysisModel } = require('../schemas');
const router = require('express').Router();

router.post('/', async (req, res) => {
  try {
    const analysis = await analysisModel.findOne({ provider: 'O_TRUYEN' });
    await analysisComic();
    if (analysis) {
      await autoCrawlComic(analysis.currentPage);
      await analysisModel.findOneAndUpdate(
        {
          provider: 'O_TRUYEN',
        },
        {
          currentPage:
            analysis.currentPage + 918 < 919 ? analysis.currentPage + 1 : 1,
        }
      );
      setTimeout(async () => {
        await updateTotalCrawledItems();
      }, 30000);
    } else {
      await analysisModel().save();
    }
    res.json({
      updated: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

router.post('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    await createComic(slug);
    res.json({
      updated: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
