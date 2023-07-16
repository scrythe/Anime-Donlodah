import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Anime {
  name: string;
  link: string;
}

// const randomChromeUserAgent = randomUseragent.getRandom(
//   (ua) => ua.browserName === 'Chrome'
// );

async function createPuppeteerBrowser(): Promise<Browser> {
  puppeteer.use(StealthPlugin());
  const browser: Browser = await puppeteer.launch({ headless: false });
  return browser;
}

async function createNewPage(
  browser: Browser,
  skipRequests: boolean
): Promise<Page> {
  const page = await browser.newPage();
  // await page.setUserAgent(randomChromeUserAgent);

  //Randomize viewport size
  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  if (!skipRequests) return page;
  //Skip images/styles/fonts loading for performance
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (
      req.resourceType() == 'stylesheet' ||
      req.resourceType() == 'font' ||
      req.resourceType() == 'image'
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page;
}

async function selectorNotFound(browser: Browser) {
  console.log('Selector not found');
  const page = await createNewPage(browser, false);
  await page.goto('https://9anime.to/az-list');
  return;
}

async function addAnimesToDb() {
  const animes = await getAnimeList();
  await prisma.anime.createMany({ data: animes });
}

async function getAnimeList(): Promise<Anime[]> {
  const browser = await createPuppeteerBrowser();
  const page = await createNewPage(browser, true);
  const animesAmount = await getAnimesAmount(browser, page);
  const allAnimes = await getAllAnimes(page, animesAmount);
  browser.close();
  return allAnimes;
}

async function getAnimesAmount(browser: Browser, page: Page): Promise<number> {
  await page.goto('https://9anime.to/az-list');
  let lastPageLinkEl = await page
    .waitForSelector('a.page-link[rel=last]', {
      timeout: 5000,
    })
    .catch(() => selectorNotFound(browser));
  if (!lastPageLinkEl)
    lastPageLinkEl = await page.waitForSelector('a.page-link[rel=last]', {
      timeout: 0,
    });

  const lastPageLink = await lastPageLinkEl.evaluate((el) => el.href);
  const lastPageNumberStr = lastPageLink.split('page=')[1];
  return parseInt(lastPageNumberStr);
}

async function getAllAnimes(
  page: Page,
  animesAmount: number
): Promise<Anime[]> {
  const animes: Anime[] = [];
  for (let pageNumber = 1; pageNumber <= animesAmount; pageNumber++) {
    const animesFromPage = await getAnimesFromPage(page, pageNumber);
    animes.push(...animesFromPage);
  }
  return animes;
}

async function getAnimesFromPage(
  page: Page,
  pageNumber: number
): Promise<Anime[]> {
  await page.goto(`https://9anime.to/az-list?page=${pageNumber}`);
  await page.waitForSelector('div#list-items');
  const animes = await page.evaluate(() => {
    const animeItems = document.querySelectorAll<HTMLAnchorElement>(
      'div#list-items div.item a.name.d-title'
    );
    const animes: Anime[] = Array.from(animeItems).map((animeItem) => {
      const name = animeItem.textContent;
      const link = animeItem.href;
      return { name, link };
    });
    return animes;
  });
  return animes;
}

addAnimesToDb();
export default addAnimesToDb;
