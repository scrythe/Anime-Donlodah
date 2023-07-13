import axios from 'axios';
import { JSDOM } from 'jsdom';

interface Anime {
  name: string;
  link: string;
}

interface AnimeFromPage {
  page: number;
  animes: Anime[];
}

async function getDomOfPage(url: string): Promise<Document> {
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'private',
      Cookie: 'private',
    },
  });
  const dom = new JSDOM(res.data);
  return dom.window.document;
}

async function getAnimeList() {
  const animesAmount = await getAnimesAmount();
  const allAnimes = await getAllAnimes(animesAmount);
  console.log(allAnimes);
}

async function getAnimesAmount(): Promise<number> {
  const document = await getDomOfPage('https://9anime.to/az-list');
  const lastPageLink = document.querySelector<HTMLAnchorElement>(
    'a.page-link[rel=last]'
  );
  const lastPageNumberStr = lastPageLink.href.split('page=')[1];
  return parseInt(lastPageNumberStr);
}

function getAllAnimes(animesAmount: number) {
  const promises: Promise<AnimeFromPage>[] = [];
  for (let page = 1; page <= animesAmount; page++) {
    promises.push(getAnimesFromPage(page));
  }
  // return Promise.all(promises);
}

async function getAnimesFromPage(page: number): Promise<AnimeFromPage> {
  const document = await getDomOfPage(`https://9anime.to/az-list?page=${page}`);
  const animeItems = document.querySelectorAll<HTMLAnchorElement>(
    'div#list-items div.item .name.d-title'
  );
  const animes: Anime[] = Array.from(animeItems).map((animeItem) => {
    const name = animeItem.textContent;
    const link = animeItem.href;
    return { name, link };
  });
  console.log(animes);
  return { page, animes };
}

getAnimeList();

export default getAnimeList;
