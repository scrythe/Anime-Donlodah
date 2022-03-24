import axios from 'axios';
import { load } from 'cheerio';
import { Browser } from 'puppeteer';

const animeEpisodes: string[] = [
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',

  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-19',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
];

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

function getRedirectLinks(animeEpisodes: string[]): Promise<string[]> {
  return new Promise(async (resolve) => {
    const animeStreamLinksPromises = animeEpisodes.map((link) =>
      getRedirectUrl(link).catch((error) => console.error(error))
    );
    const animeStreamLinksResolved = await Promise.all(
      animeStreamLinksPromises
    );
    const animeStreamLinks = animeStreamLinksResolved.filter(
      (link): link is string => {
        return !!link;
      }
    );
    resolve(animeStreamLinks);
  });
}

function getStreamLinks(
  browser: Browser,
  animeStreamLinks: string[]
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const streamTapeUrlsPromises = animeStreamLinks.map((url) => {
      return goToUrl(browser, url).catch((error) => console.error(error));
    });
    const streamTapeUrlsResolved = await Promise.all(streamTapeUrlsPromises);
    const streamTapeUrls = streamTapeUrlsResolved.filter(
      (url): url is string => {
        return !!url;
      }
    );
    resolve(streamTapeUrls);
  });
}

export function getStreamtapeLinks(browser: Browser): Promise<string[]> {
  return new Promise(async (resolve) => {
    const redirectLinks = await getRedirectLinks(animeEpisodes);
    const streamLinks = await getStreamLinks(browser, redirectLinks);
    resolve(streamLinks);
  });
}
