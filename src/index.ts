import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { getMultipleStreamTapeLinks } from './functions/get-stream-links.js';
import { getMultipleDownloadLinks } from './functions/get-download-links.js';
import { downloadMultipleVideos } from './functions/download-videos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
];

(async () => {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });

  const instanceLimit = 5;
  const animeEpisodesChunks = getSplittedLinkArray(
    animeEpisodes,
    instanceLimit
  );

  const streamTapeLinks = await getMultipleStreamTapeLinks(
    browser,
    animeEpisodesChunks,
    instanceLimit
  );
  const downloadLinks = await getMultipleDownloadLinks(
    browser,
    streamTapeLinks
  );

  browser.close();

  let saveFolder = join(__dirname, '..', 'downloads');
  await downloadMultipleVideos(downloadLinks, saveFolder);
})();

function getSplittedLinkArray(links: string[], instanceLimit: number) {
  const splittedLinkArray: Array<string[]> = new Array();
  for (let index = 0; index < instanceLimit; index++) {
    const chunkOfLinks: string[] = new Array();
    for (
      let chunkIndex = index;
      chunkIndex < links.length;
      chunkIndex += instanceLimit
    ) {
      const link = links[chunkIndex];
      chunkOfLinks.push(link);
    }
    splittedLinkArray.push(chunkOfLinks);
  }
  return splittedLinkArray;
}
