import axios from 'axios';
import { load } from 'cheerio';
import { Browser } from 'puppeteer';

function getRedirectUrl(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const mainUrl = new URL(url);
    const res = await axios.get(url).catch((error) => reject(error));
    if (!res) return;
    const $ = load(res.data);
    const linkElement = $(
      '.hosterSiteVideo > ul > li > div > a > h4:contains(Streamtape)'
    )
      .parent()
      .attr('href');
    if (!linkElement)
      return reject(`Element ${linkElement} not found on site ${url}`);
    mainUrl.pathname = linkElement;
    resolve(mainUrl.href);
  });
}

function goToUrl(browser: Browser, url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const streamTapeUrl = new URL('https://streamtape.com/');
    const page = await browser.newPage();
    await page.goto(url);
    const puppeteerUrl = new URL(page.url());
    if (puppeteerUrl.hostname != streamTapeUrl.hostname) await page.reload();
    // recaptcha challenge expires in two minutes
    const redirectPage = await page
      .waitForNavigation({ timeout: 120000 })
      .catch((error) => reject(error));
    if (!redirectPage) return;
    puppeteerUrl.href = page.url();
    if (puppeteerUrl.hostname != streamTapeUrl.hostname)
      return reject(`Page: ${page.url()} is not a Streamtape url`);
    const streamTapeUrlLink = page.url();
    page.close();
    resolve(streamTapeUrlLink);
  });
}

function getStreamTapeLink(browser: Browser, link: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const redirectUrl = await getRedirectUrl(link).catch((error) =>
      reject(error)
    );
    if (!redirectUrl) return;
    const streamLink = await goToUrl(browser, redirectUrl).catch((error) =>
      reject(error)
    );
    if (!streamLink) return;
    resolve(streamLink);
  });
}

function* getRedirectUrlGenerator(
  browser: Browser,
  links: string[]
): Generator<Promise<string>> {
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    yield getStreamTapeLink(browser, link);
  }
}

export function getRedirectUrlGen(
  browser: Browser,
  links: string[]
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const redirectUrlObject = getRedirectUrlGenerator(browser, links);
    const allLinks: string[] = new Array();
    for (const link of redirectUrlObject) {
      const streamTapeLink = await link.catch((error) => console.error(error));
      if (!streamTapeLink) continue;
      allLinks.push(streamTapeLink);
    }
    resolve(allLinks);
  });
}

/* export function getMultipleStreamTapeLinks(
  browser: Browser,
  links: string[]
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const downloadLinksPromises = links.map((link) => {
      return getStreamTapeLink(browser, link).catch((error) =>
        console.error(error)
      );
    });
    const downloadLinksResolved = await Promise.all(downloadLinksPromises);
    const downloadLinks = downloadLinksResolved.filter((url): url is string => {
      return !!url;
    });
    resolve(downloadLinks);
  });
} */
