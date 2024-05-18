const { PAGE } = require('../constants');
const { analysisModel, comicModel } = require('../schemas');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const savedDoc = await analysisModel.findOne({
      provider: 'O_TRUYEN',
    });
    if (!savedDoc) {
      await analysisModel({
        currentPage: PAGE,
      }).save();
    }
    res.json({
      page: savedDoc?.page || +PAGE,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
