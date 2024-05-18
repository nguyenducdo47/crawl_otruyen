const { viewModel, comicModel } = require("../schemas");

const updateViews = async (slug) => {
  try {
    const [savedView, savedComic] = await Promise.all([
      viewModel.findOne({ comic_slug: slug }),
      comicModel.findOne({ slug }),
    ]);
    await updateViewsByType(slug, savedView);
    return await comicModel.findOneAndUpdate(
      {
        slug,
      },
      {
        total_views: (savedComic.total_views || 0) + 1,
      },
      { new: true }
    );
  } catch (err) {
    throw new Error(err);
  }
};

const updateViewsByType = async (comic_slug, doc) => {
  try {
    if (!doc) {
      await viewModel({
        comic_slug,
        daily_views: 1,
        weekly_views: 1,
        monthly_views: 1,
      }).save();
    } else {
      await viewModel.findOneAndUpdate(
        { comic_slug },
        {
          daily_views: doc.daily_views + 1,
          weekly_views: doc.weekly_views + 1,
          monthly_views: doc.monthly_views + 1,
        }
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  updateViews,
  updateViewsByType,
};
