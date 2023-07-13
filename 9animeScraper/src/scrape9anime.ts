import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import randomUseragent from 'random-useragent';

interface Anime {
  name: string;
  link: string;
}

async function createPuppeteerBrowser(): Promise<Browser> {
  puppeteer.use(StealthPlugin());
  const browser: Browser = await puppeteer.launch({ headless: false });
  return browser;
}

async function createNewPage(browser: Browser): Promise<Page> {
  //Randomize User agent or Set a valid one
  const userAgent = randomUseragent.getRandom();
  const page = await browser.newPage();
  await page.setUserAgent(userAgent);

  //Randomize viewport size
  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

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

async function makePageWaitRandomTime(page: Page) {
  await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);
}

async function selectorNotFound(page: Page) {
  await page.setRequestInterception(false);
  console.log('Selector not found');
}

async function getAnimeList() {
  const browser = await createPuppeteerBrowser();
  const page = await createNewPage(browser);
  const animesAmount = await getAnimesAmount(page);
  console.log(animesAmount);
  const allAnimes = await getAllAnimes(page, animesAmount);
  console.log(allAnimes);
  browser.close();
  return;
}

async function getAnimesAmount(page: Page): Promise<number> {
  page.goto('https://9anime.to/az-list');
  const lastPageLinkEl = await page.waitForSelector('a.page-link[rel=last]');
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

getAnimeList();

export default getAnimeList;
