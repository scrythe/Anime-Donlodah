import axios from 'axios';
import { load } from 'cheerio';
import { Browser } from 'puppeteer';
import { createContext, runInContext } from 'vm';
import { createWriteStream } from 'fs';
import { get } from 'https';

export function getStreamLinks(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let mainUrl = new URL(url);
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject();
    });
    const $ = load(res.data);
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

export function goToUrl(browser: Browser, url: string): Promise<string> {
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

export function getDownloadLink(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject
    });
    const $ = load(res.data);
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

export function getVideoUrl(
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
    createContext(sandBox);
    runInContext(videoLinkFunction, sandBox);
    if (sandBox.videoLink) {
      resolve(sandBox.videoLink);
    } else {
      reject(`Element ${sandBox.videoLink} not found on site ${url}`);
    }
  });
}

export async function videoDownloadLinksFunction(
  browser: Browser,
  link: string
): Promise<string> {
  let page = await browser.newPage();
  page.goto(link);
  await page.waitForNavigation();
  let videoDownloadLink = page.url();
  page.close();
  return videoDownloadLink;
}

export function downloadVideos(
  link: string,
  saveFolder: string,
  callback: () => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    let file = createWriteStream(saveFolder);
    get(link, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        // console.log('download complete');
        file.close(callback);
        resolve();
      });
    });
  });
}
