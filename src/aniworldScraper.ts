import axios from 'axios';
import { load } from 'cheerio';
import { Browser } from 'puppeteer';

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
    const page = await browser.newPage();
    await page.goto(redirectLink);
    await page.waitForNavigation();
    resolve(page.url());
    // const pageUrl = new URL(page.url());
    // if (pageUrl.hostname == 'voeun-block.net')
  });
}

export function getVoeLink(browser: Browser, episode: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const redirectLink = await getRedirectVoeLink(episode).catch((error) =>
      reject(error)
    );
    if (!redirectLink) return;
    const voeLink = getLinkToVoe(browser, redirectLink);
    resolve(voeLink);
  });
}
