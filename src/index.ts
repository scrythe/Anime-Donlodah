import episodes from './episode-list.json';
import puppeteer from 'puppeteer';
import { getVoeLink } from './aniworldScraper';
import { getM3u8Link } from './voeScraper';

async function downloadVideos(episode: string) {
  const browser = await puppeteer.launch({ headless: false });
  const voeLink = await getVoeLink(browser, episode);
  const m3u8Link = await getM3u8Link(voeLink);
  console.log(m3u8Link);
  // download videos
  browser.close();
}

const firstEpisode = episodes[0];
if (firstEpisode) {
  downloadVideos(firstEpisode);
}
