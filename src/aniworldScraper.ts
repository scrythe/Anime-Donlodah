import axios from 'axios';
import { load } from 'cheerio';
import { Browser } from 'puppeteer';
import UserAgent from 'user-agents';
import PQueue from 'p-queue';
import { Episode } from './interfaces';

function getRedirectVoeLink(episode: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(episode);
    const $ = load(res.data);
    const linkElement = $(
      '.hosterSiteVideo > ul > li > div > a > h4:contains(VOE)'
    )
      .parent()
      .attr('href');
    if (!linkElement) return reject();
    const voeLink = new URL(episode);
    voeLink.pathname = linkElement;
    resolve(voeLink.href);
  });
}

function getLinkToVoe(browser: Browser, redirectLink: string): Promise<string> {
  return new Promise(async (resolve) => {
    const userAgent = new UserAgent();
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    await page.goto(redirectLink);
    await page.waitForNavigation();
    const pageUrl = page.url();
    page.close();
    resolve(pageUrl);
  });
}

function getVoeLink(browser: Browser, episode: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const redirectLink = await getRedirectVoeLink(episode).catch((error) =>
      reject(error)
    );
    if (!redirectLink) return;
    const voeLink = getLinkToVoe(browser, redirectLink);
    resolve(voeLink);
  });
}

export async function getAllVoeLinks(browser: Browser, episodes: Episode[]) {
  const pqueueOptions = { concurrency: 5 };
  const queue = new PQueue(pqueueOptions);
  const voeLinkPromises = episodes.map(
    (episode) => () => getVoeLink(browser, episode.url)
  );
  const voeLinks = await queue.addAll(voeLinkPromises);
  return voeLinks;
}
