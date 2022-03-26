import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { getRedirectUrlGen } from './functions/get-stream-links.js';
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

const testArray: string[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
];

(async () => {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });

  const streamTapeLinks = await getRedirectUrlGen(browser, animeEpisodes);

  const downloadLinks = await getMultipleDownloadLinks(
    browser,
    streamTapeLinks
  );

  browser.close();

  let saveFolder = join(__dirname, '..', 'downloads');

  await downloadMultipleVideos(downloadLinks, saveFolder);
})();

/* (async () => {
  const newArray = loopOverArray(testArray, 5);
  console.log(newArray);
})();

function splitArray(links: string[], instanceLimit: number): string[] {
  const newArray: string[] = new Array();
  for (let index = 0; index < links.length; index += instanceLimit) {
    const link = links[index];
    newArray.push(link);
  }
  return newArray;
}

function loopOverArray(links: string[], instanceLimit: number) {
  // let test: string[] = ['42', '42'];
  // let test2: string[][] = [test, test];
  const totalArray: Array<string[]> = new Array();
  for (let index = 0; index < instanceLimit; index++) {
    const newArray: string[] = new Array();
    for (
      let linkIndex = index;
      linkIndex < links.length;
      linkIndex += instanceLimit
    ) {
      const link = links[linkIndex];
      newArray.push(link);
    }
    totalArray.push(newArray);
  }
  return totalArray;
} */
