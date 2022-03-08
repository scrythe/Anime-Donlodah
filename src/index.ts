import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

let animeEpisodes: string[] = [
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-19',
  'https://anicloud.io/anime/stream/toradora/staffel-1/episode-20',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-21',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-22',
];

function getStreamLinks(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let mainUrl = new URL(url);
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject();
    });
    const $ = cheerio.load(res.data);
    let linkElement = $(
      '.hosterSiteVideo > ul > li > div > a > h4:contains(VOE)'
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
    let voeUrl = new URL('https://voe.sx/');
    const page = await browser.newPage();
    await page.goto(url);
    let puppeteerUrl = new URL(page.url());
    if (puppeteerUrl.hostname != voeUrl.hostname) {
      await page.reload();
    }
    // recaptcha challenge expires in two minutes
    await page.waitForNavigation().catch(async (error) => {
      console.error(error);
      await page.reload();
      await page.waitForNavigation();
    });
    puppeteerUrl.href = page.url();
    if (puppeteerUrl.hostname == voeUrl.hostname) {
      let voeUrlLink = page.url();
      page.close();
      resolve(voeUrlLink);
    } else {
      reject(`Page: ${page.url()} is not a VOE url`);
    }
  });
}

async function getDownloadLink(browser: Browser, url: string) {
  let xbudUrl = new URL('https://9xbud.com/');
  xbudUrl.pathname = url;
  let page = await browser.newPage();
  await page.goto(xbudUrl.href);
  // await page.waitForNavigation();
  let downloadLinkXpath =
    "//a/span[contains(text(), 'Download Now')]/parent::a";
  await page.waitForXPath(downloadLinkXpath);
  let downloadLinks = await page.$x(downloadLinkXpath);
  let getdownloadLinkJson = await downloadLinks[1].getProperty('href');
  let getDownloadLink: string = await getdownloadLinkJson.jsonValue();
  console.log(getDownloadLink);
}

(async () => {
  let animeStreamLinksPromises = animeEpisodes.map((link) =>
    getStreamLinks(link).catch((error) => console.error(error))
  );
  let animeStreamLinks = (await Promise.all(animeStreamLinksPromises)).filter(
    (link): link is string => {
      return !!link;
    }
  );
  const browser = await puppeteer
    .use(StealthPlugin())
    .launch({ headless: false });
  let voeUrlsPromises = animeStreamLinks.map((url) => {
    return goToUrl(browser, url).catch((error) => console.error(error));
  });
  let voeUrls = (await Promise.all(voeUrlsPromises)).filter(
    (url): url is string => {
      return !!url;
    }
  );
  voeUrls.forEach((url) => getDownloadLink(browser, url));
  // getDownloadLink(browser, 'https://voe.sx/e/7ssj4bw9djeg');
})();
