import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import vm from 'vm';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let animeEpisodes: string[] = [
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-8',
  // 'https://anicloud.io/anime/stream/toradora/staffel-1/episode-19',
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
    let streamTapeUrl = new URL('https://streamtape.com/');
    const page = await browser.newPage();
    await page.goto(url);
    let puppeteerUrl = new URL(page.url());
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
      let streamTapeUrlLink = page.url();
      page.close();
      resolve(streamTapeUrlLink);
    } else {
      reject(`Page: ${page.url()} is not a Streamtape url`);
    }
  });
}

function getDownloadLink(browser: Browser, url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject
    });
    const $ = cheerio.load(res.data);
    let getElementText = "document.getElementById('robotlink').innerHTML";
    let scriptTag = $(`script:contains(${getElementText})`).html();
    if (scriptTag) {
      let videoLink = await getVideoUrl(scriptTag, getElementText, url).catch(
        (error) => reject(error)
      );
      if (videoLink) {
        resolve(videoLink);
      }
    } else {
      reject(`Element ${scriptTag} not found on site ${url}`);
    }
  });
}

function getVideoUrl(
  scriptTag: string,
  getElementText: string,
  url: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    let scriptTagBeginning = scriptTag.indexOf(getElementText);
    let scriptTagEnding = scriptTag.lastIndexOf(';');
    let scriptTagFunction = scriptTag.substring(
      scriptTagBeginning,
      scriptTagEnding
    );
    let videoLinkFunction = scriptTagFunction.replace(
      getElementText,
      'videoLink'
    );
    const sandBox = { videoLink: 'toradora' };
    vm.createContext(sandBox);
    vm.runInContext(videoLinkFunction, sandBox);
    if (sandBox.videoLink) {
      resolve(sandBox.videoLink);
    } else {
      reject(`Element ${sandBox.videoLink} not found on site ${url}`);
    }
  });
}

function downloadVideos(
  link: string,
  saveFolder: string,
  callback: () => void
) {
  let file = fs.createWriteStream(saveFolder);
  https.get(link, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      // console.log('download complete');
      file.close(callback);
    });
  });
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
  let streamTapeUrlsPromises = animeStreamLinks.map((url) => {
    return goToUrl(browser, url).catch((error) => console.error(error));
  });
  let streamTapeUrls = (await Promise.all(streamTapeUrlsPromises)).filter(
    (url): url is string => {
      return !!url;
    }
  );
  let downloadLinksPromises = streamTapeUrls.map((url) => {
    return getDownloadLink(browser, url).catch((error) => console.error(error));
  });
  let downloadLinks = (await Promise.all(downloadLinksPromises)).filter(
    (link): link is string => {
      return !!link;
    }
  );
  let saveFolder = path.join(__dirname, '..', 'downloads', 'toradora.mp4');
  downloadLinks.forEach(async (link) => {
    let url = new URL(`https:${link}`);
    console.log(url.href);
    downloadVideos(url.href, saveFolder, () => {
      console.log(`successfully downloaded video from link ${link}`);
    });
  });
})();
