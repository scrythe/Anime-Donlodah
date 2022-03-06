import axios from 'axios';
import * as cheerio from 'cheerio';

let animeEpisodes: string[] = [
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-19',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
];
// document.querySelector('.hosterSiteVideo > ul li div a h4')

function getStreamLinks(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let mainUrl = new URL(url);
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    let linkElement = $(
      '.hosterSiteVideo > ul > li > div > a > h4:contains(Streamtape)'
    )
      .parent()
      .attr('href');
    if (!linkElement) {
      reject(`Element ${linkElement} not found on site ${url}`);
    }
    mainUrl.pathname = linkElement ?? 'undefined';
    resolve(mainUrl.href);
  });
}

(() => {
  getStreamLinks(
    'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8'
  )
    .then((link) => console.log(link))
    .catch((err) => console.log(err));
})();

/* (async () => {
  const browser = await puppeteer.launch({ headless: false });
  animeEpisodes.forEach((url) => goToUrl(browser, url));
})(); */

/* async function goToUrl(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
} */
