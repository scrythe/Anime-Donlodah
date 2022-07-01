import episodes from './episode-list.json';
import puppeteer from 'puppeteer';
import { getVoeLink } from './aniworldScraper';

async function downloadVideos(episode: string) {
  const browser = await puppeteer.launch({ headless: false });
  const voeLink = await getVoeLink(browser, episode);
  console.log(voeLink);
  // get voe links
  // get m3u8 download links
  // download videos
  browser.close();
}

const firstEpisode = episodes[0];
if (firstEpisode) {
  downloadVideos(firstEpisode);
}
