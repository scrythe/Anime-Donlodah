import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

import { downloadVideos } from './functions/download-function.js';
import { getMultipleSteamTapeLinks } from './functions/get-stream-links.js';
import { getMultipleDownloadLinks } from './functions/get-download-links.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let animeEpisodes: string[] = [
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',

  // 'https://anicloud.io/anime/stream/toradora/staffel-1/-episode19',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
];

(async () => {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });

  const streamTapeLinks = await getMultipleSteamTapeLinks(
    browser,
    animeEpisodes
  );
  const downloadLinks = await getMultipleDownloadLinks(
    browser,
    streamTapeLinks
  );
  browser.close();
  let saveFolder = join(__dirname, '..', 'downloads');
  for (const link of downloadLinks) {
    let fileName = basename(link);
    let pathToFile = join(saveFolder, fileName);
    await downloadVideos(link, pathToFile, () => {
      console.log(`successfully downloaded video ${fileName}`);
    });
  }
})();
