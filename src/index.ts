import episodes from './episode-list.json';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getVoeLink } from './aniworldScraper';
import { getM3u8Link } from './voeScraper';
import { hlsDownload } from './utils';

interface Episode {
  name: string;
  url: string;
}

async function downloadVideos(episodes: Episode[]) {
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });

  const voeLinkPromises = episodes.map((episode) =>
    getVoeLink(browser, episode.url)
  );
  const voeLinks = await Promise.all(voeLinkPromises);
  browser.close();

  const m3u8LinkPromises = voeLinks.map((voeLink) => getM3u8Link(voeLink));
  const m3u8Links = await Promise.all(m3u8LinkPromises);

  for (let index = 0; index < m3u8Links.length; index++) {
    const m3u8Link = m3u8Links[index];
    const episodeName = episodes[index]?.name;
    if (!m3u8Link) continue;
    await hlsDownload(m3u8Link, `downloads/${episodeName}.mp4`);
  }
}

downloadVideos(episodes);
