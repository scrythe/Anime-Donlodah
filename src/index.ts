import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

import {
  getStreamLinks,
  goToUrl,
  getDownloadLink,
  videoDownloadLinksFunction,
  downloadVideos,
} from './downloadFunction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let animeEpisodes: string[] = [
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',

  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-19',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
];

(async () => {
  let animeStreamLinksPromises = animeEpisodes.map((link) =>
    getStreamLinks(link).catch((error) => console.error(error))
  );
  let animeStreamLinks = (await Promise.all(animeStreamLinksPromises)).filter(
    (link): link is string => {
      return !!link;
    }
  );
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });
  let streamTapeUrlsPromises = animeStreamLinks.map((url) => {
    return goToUrl(browser, url).catch((error) => console.error(error));
  });
  let streamTapeUrls = (await Promise.all(streamTapeUrlsPromises)).filter(
    (url): url is string => {
      return !!url;
    }
  );
  let downloadLinksPromises = streamTapeUrls.map((url) => {
    return getDownloadLink(url).catch((error) => console.error(error));
  });
  let downloadLinks = (await Promise.all(downloadLinksPromises)).filter(
    (link): link is string => {
      return !!link;
    }
  );
  let videoDownloadLinksPromises = downloadLinks.map((link) => {
    let url = new URL(`https:${link}`);
    return videoDownloadLinksFunction(browser, url.href);
  });
  let videoDownloadLinks = await Promise.all(videoDownloadLinksPromises);
  browser.close();
  let saveFolder = join(__dirname, '..', 'downloads');
  for (const link of videoDownloadLinks) {
    let fileName = basename(link);
    let pathToFile = join(saveFolder, fileName);
    await downloadVideos(link, pathToFile, () => {
      console.log(`successfully downloaded video ${fileName}`);
    });
  }
})();
