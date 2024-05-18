const formatCategory = (ids, categories) => {
  return categories.filter((cate) => ids.includes(cate._id.toString()));
};

module.exports = { formatCategory };
