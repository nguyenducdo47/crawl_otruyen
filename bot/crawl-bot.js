const { fetch, Agent } = require("undici");
const { OTRUYEN_BASE_URL } = require("../constants");
const { createComic } = require("../controllers/comic.controller");

const fetchComics = async (page) => {
  const response = await fetch(
    `${OTRUYEN_BASE_URL}/danh-sach/truyen-moi?page=${page}`,
    {
      dispatcher: new Agent({ connectTimeout: 60e3 }),
    }
  );
  const data = await response.json();
  return data;
};

const autoCrawlComic = async (currentPage) => {
  const data = await fetchComics(currentPage);
  let totalItemsPerPage = data.data.params.pagination.totalItemsPerPage;
  for (let i = 0; i < totalItemsPerPage; i++) {
    const slug = data.data.items[i].slug;
    setTimeout(async () => {
      await createComic(slug);
    }, i * 8000);
  }
};

module.exports = {
  autoCrawlComic,
  fetchComics,
};
