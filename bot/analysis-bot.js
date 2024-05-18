const { analysisModel, comicModel } = require('../schemas');
const { fetchComics } = require('./crawl-bot');

const analysisComic = async () => {
  const data = await fetchComics(1);
  const pagination = data.data.params.pagination;
  await analysisModel.findOneAndUpdate(
    {
      provider: 'O_TRUYEN',
    },
    {
      totalItem: pagination.totalItems,
      totalPage: Math.ceil(
        pagination.totalItems / pagination.totalItemsPerPage
      ),
    }
  );
};

const updateTotalCrawledItems = async () => {
  const currentItem = await comicModel.countDocuments({});
  await analysisModel.findOneAndUpdate(
    {
      provider: 'O_TRUYEN',
    },
    {
      currentItem,
    }
  );
};

module.exports = {
  analysisComic,
  updateTotalCrawledItems,
};
