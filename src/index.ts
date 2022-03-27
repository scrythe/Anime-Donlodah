import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { join } from 'path';

import { getMultipleStreamTapeLinks } from './functions/get-stream-links.js';
import { getMultipleDownloadLinks } from './functions/get-download-links.js';
import { downloadMultipleVideos } from './functions/download-videos.js';
import { __dirname } from './functions/functions.js';

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

  const instanceLimit = 82;
  const streamTapeLinks = await getMultipleStreamTapeLinks(
    animeEpisodes,
    instanceLimit,
    browser
  );
  const downloadLinks = await getMultipleDownloadLinks(
    browser,
    streamTapeLinks
  );

  browser.close();

  let saveFolder = join(__dirname, '..', 'downloads');
  await downloadMultipleVideos(downloadLinks, saveFolder);
})();
