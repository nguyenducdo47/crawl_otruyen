const { fetch, Agent } = require('undici');
const { OTRUYEN_BASE_URL } = require('../constants');
const { comicModel, categoryModel, chapterModel } = require('../schemas');
const { createChapter } = require('./chapter.controller');

const createComic = async (slug) => {
  const response = await fetch(`${OTRUYEN_BASE_URL}/truyen-tranh/${slug}`, {
    dispatcher: new Agent({ connectTimeout: 60e3 }),
  });
  const data = await response.json();
  const { _id, chapters, origin_name, ...info } = data.data.item;
  const [savedComic, savedChapters] = await Promise.all([
    comicModel.findOne({
      slug: info.slug,
    }),
    chapterModel.find({
      comic_slug: info.slug,
    }),
  ]);
  const category = [];
  for (let cate of info.category) {
    const savedCategory = await categoryModel.findOne({
      slug: cate.slug,
    });
    if (!savedCategory) {
      const newCategory = await new categoryModel({
        name: cate.name,
        slug: cate.slug,
      }).save();
      category.push(newCategory._id.toString());
    } else {
      category.push(savedCategory._id.toString());
    }
  }
  const originChapters = chapters?.[0]?.server_data || [];
  if (!savedComic) {
    await new comicModel({
      ...info,
      category,
      origin_name: origin_name.filter(Boolean),
    }).save();
    await createChapter(originChapters, info.slug);
    return;
  }
  if (
    (savedComic && savedComic.updatedAt !== info.updatedAt) ||
    savedChapters.length !== originChapters.length
  ) {
    await comicModel.findOneAndUpdate(
      {
        slug: info.slug,
      },
      {
        ...info,
        category,
      }
    );
    const chapterNames = savedChapters.map((c) => c.name);
    const notCrawledChapters = originChapters.filter(
      (c) => !chapterNames.includes(c.chapter_name)
    );
    await createChapter(notCrawledChapters, info.slug);
  }
};

module.exports = {
  createComic,
};
