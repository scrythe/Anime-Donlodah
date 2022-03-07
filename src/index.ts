import axios from 'axios';
import * as cheerio from 'cheerio';

let animeEpisodes: string[] = [
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',
  'https://anicloud.io',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-19',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
];
// document.querySelector('.hosterSiteVideo > ul li div a h4')

function getStreamLinks(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let mainUrl = new URL(url);
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject();
    });
    const $ = cheerio.load(res.data);
    let linkElement = $(
      '.hosterSiteVideo > ul > li > div > a > h4:contains(Streamtape)'
    )
      .parent()
      .attr('href');
    if (linkElement) {
      mainUrl.pathname = linkElement;
      resolve(mainUrl.href);
    } else {
      reject(`Element ${linkElement} not found on site ${url}`);
    }
  });
}

(async () => {
  let animeStreamLinksPromises = animeEpisodes.map((link) =>
    getStreamLinks(link).catch((error) => console.error(error))
  );
  let animeStreamLinks = (await Promise.all(animeStreamLinksPromises)).filter(
    (link): link is string => {
      return !!link;
    }
  );
  console.log(animeStreamLinks);

  /* let animeStreamLinks = await animeEpisodes.map(async (link) => {
    let test = await getStreamLinks(link);
    return await getStreamLinks(link);
  });
  console.log(animeStreamLinks); */
  /* animeEpisodes.forEach((link) => {
    getStreamLinks(
      'https://anicloud.io/anime/stream/toradora/staffel-1/episode-800'
    )
      .then((link) => console.log(link))
      .catch((err) => console.log(err));
  }); */
})();

/* (async () => {
  const browser = await puppeteer.launch({ headless: false });
  animeEpisodes.forEach((url) => goToUrl(browser, url));
})(); */

/* async function goToUrl(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
} */
