import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { basename, join } from 'path';

import { getEpisodes } from './functions/get-episode-list';
import { getMultipleStreamTapeLinks } from './functions/get-stream-links';
import { downloadVideo } from './functions/download-videos';
import { getDownloadLinkGenerator } from './functions/functions';

(async () => {
  const animeEpisodes = await getEpisodes().catch((error) =>
    console.error(error)
  );
  if (!animeEpisodes) return;

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
