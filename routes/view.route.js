const { viewModel } = require("../schemas");

const router = require("express").Router();

const viewTypes = ["daily", "weekly", "monthly"];

viewTypes.forEach((type) => {
  router.put(`/${type}/reset`, async (req, res) => {
    try {
      await viewModel.updateMany({}, { [`${type}_views`]: 0 });
      res.json({
        updated: true,
      });
    } catch (err) {
      throw new Error(err);
    }
  });
});

module.exports = router;
