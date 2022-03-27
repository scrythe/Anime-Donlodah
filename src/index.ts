import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { dirname, basename, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { getMultipleStreamTapeLinks } from './functions/get-stream-links.js';
import { downloadVideo } from './functions/download-videos.js';
import { getDownloadLinkGenerator } from './functions/functions.js';

let animeEpisodes: string[] = [
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/-episode19',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-800',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/jujutsu-kaisen/staffel-1/episode-8',
];

(async () => {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });

  const instanceLimit = 4;
  const streamTapeLinks = await getMultipleStreamTapeLinks(
    animeEpisodes,
    instanceLimit,
    browser
  );

  const getDownloadLinkObject = getDownloadLinkGenerator(
    streamTapeLinks,
    browser
  );
  const saveFolder = join(__dirname, '..', 'downloads');

  for (const downloadLinkPromise of getDownloadLinkObject) {
    const downloadLink = await downloadLinkPromise.catch((error) =>
      console.error(error)
    );
    if (!downloadLink) return;
    const fileName = basename(downloadLink);
    const pathToFile = join(saveFolder, fileName);
    await downloadVideo(downloadLink, pathToFile, () => {
      console.log(`successfully downloaded video ${fileName}`);
    }).catch((error) => console.error(error));
  }

  browser.close();
})();
