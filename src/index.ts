import episodes from './episode-list.json';
import puppeteer from 'puppeteer';
import { getVoeLink } from './aniworldScraper';
import { getM3u8Link } from './voeScraper';
import { hlsDownload } from './utils';

async function downloadVideos(episode: string) {
  const browser = await puppeteer.launch({ headless: false });
  const voeLink = await getVoeLink(browser, episode);
  const m3u8Link = await getM3u8Link(voeLink);
  hlsDownload(m3u8Link, 'downloads/video.mp4');
  browser.close();
}

const firstEpisode = episodes[0];
if (firstEpisode) {
  downloadVideos(firstEpisode);
}
