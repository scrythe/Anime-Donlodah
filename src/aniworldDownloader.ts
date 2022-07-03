import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getAllVoeLinks } from './aniworldScraper';
import { getM3u8Link } from './voeScraper';
import { hlsDownload } from './utils';
import { Episode } from './interfaces';

async function downloadVideos(episodes: Episode[]) {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });

  const voeLinks = await getAllVoeLinks(browser, episodes);

  browser.close();

  for (let index = 0; index < voeLinks.length; index++) {
    const voeLink = voeLinks[index];
    if (!voeLink) continue;
    const m3u8Link = await getM3u8Link(voeLink);
    const episodeName = episodes[index]?.name;
    await hlsDownload(m3u8Link, `downloads/${episodeName}.mp4`);
  }
}

export default downloadVideos;
