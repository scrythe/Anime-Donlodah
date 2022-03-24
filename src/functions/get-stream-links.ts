import axios from 'axios';
import { load } from 'cheerio';
import { Browser } from 'puppeteer';

function getRedirectUrl(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const mainUrl = new URL(url);
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject();
    });
    const $ = load(res.data);
    const linkElement = $(
      '.hosterSiteVideo > ul > li > div > a > h4:contains(Streamtape)'
    )
      .parent()
      .attr('href');
    if (linkElement) {
      mainUrl.pathname = linkElement;
      resolve(mainUrl.href);
    } else {
      reject(`Element ${linkElement} not found on site ${url}`);
    }
  });
}

function goToUrl(browser: Browser, url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const streamTapeUrl = new URL('https://streamtape.com/');
    const page = await browser.newPage();
    await page.goto(url);
    const puppeteerUrl = new URL(page.url());
    if (puppeteerUrl.hostname != streamTapeUrl.hostname) {
      await page.reload();
    }
    // recaptcha challenge expires in two minutes
    await page.waitForNavigation({ timeout: 36000000 }).catch(async (error) => {
      console.error(error);
      await page.reload();
      await page.waitForNavigation();
    });
    puppeteerUrl.href = page.url();
    if (puppeteerUrl.hostname == streamTapeUrl.hostname) {
      const streamTapeUrlLink = page.url();
      page.close();
      resolve(streamTapeUrlLink);
    } else {
      reject(`Page: ${page.url()} is not a Streamtape url`);
    }
  });
}

function getStreamTapeLink(browser: Browser, link: string): Promise<string> {
  return new Promise(async (resolve) => {
    const redirectUrl = await getRedirectUrl(link);
    const streamLink = await goToUrl(browser, redirectUrl);
    resolve(streamLink);
  });
}

export function getMultipleSteamTapeLinks(
  browser: Browser,
  links: string[]
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const downloadLinksPromises = links.map((link) => {
      return getStreamTapeLink(browser, link);
    });
    const downloadLinks = await Promise.all(downloadLinksPromises);
    /* const streamTapeUrls = streamTapeUrlsResolved.filter(
      (url): url is string => {
        return !!url;
      }
    ); */
    resolve(downloadLinks);
  });
}
