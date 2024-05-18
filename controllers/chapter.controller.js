const { fetch, Agent } = require('undici');
const { chapterModel } = require('../schemas');

const createChapter = async (chapters = [], comic_slug) => {
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    setTimeout(async () => {
      const res = await fetch(chapter.chapter_api_data, {
        dispatcher: new Agent({ connectTimeout: 60e3 }),
      });
      const data = await res.json();
      const savedChapter = await chapterModel.findOne({
        comic_slug,
        name: data.data.item.chapter_name,
      });
      if (!savedChapter) {
        await chapterModel({
          comic_slug,
          name: data.data.item.chapter_name,
          title: data.data.item.chapter_title,
          path: data.data.item.chapter_path,
          totalImage: data.data.item.chapter_image.length,
        }).save();
      }
    }, i * 1000);
  }
};

module.exports = {
  createChapter,
};
