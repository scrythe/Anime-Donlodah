import axios from 'axios';
import { load } from 'cheerio';
import { createContext, runInContext } from 'vm';
import { Browser } from 'puppeteer';

function getDownloadLinkScript(url: string): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(url).catch((error) => {
      throw Error(error);
      // reject
    });
    const $ = load(res.data);
    const getElementText = "document.getElementById('robotlink').innerHTML";
    const scriptCode = $(`script:contains(${getElementText})`).html();
    resolve(scriptCode);
  });
}

function getVideoLinkVariable(scriptCode: string): string {
  const getElementText = "document.getElementById('robotlink').innerHTML";
  const scriptCodeBeginning = scriptCode.indexOf(getElementText);
  const scriptCodeEnding = scriptCode.lastIndexOf(';');
  const scriptCodeFunction = scriptCode.substring(
    scriptCodeBeginning,
    scriptCodeEnding
  );
  const videoLinkVariable = scriptCodeFunction.replace(
    getElementText,
    'videoLink'
  );
  return videoLinkVariable;
}

function getVideoUrl(videoLinkVariable: string, url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const sandBox = { videoLink: 'toradora' };
    createContext(sandBox);
    runInContext(videoLinkVariable, sandBox);
    if (sandBox.videoLink) {
      resolve(sandBox.videoLink);
    } else {
      reject(`Element ${sandBox.videoLink} not found on site ${url}`);
    }
  });
}

function getRedirectedLink(browser: Browser, link: string): Promise<string> {
  return new Promise(async (resolve) => {
    let page = await browser.newPage();
    page.goto(link);
    await page.waitForNavigation();
    let videoDownloadLink = page.url();
    page.close();
    resolve(videoDownloadLink);
  });
}

function getDownloadLink(browser: Browser, url: string): Promise<string> {
  return new Promise(async (resolve) => {
    const scriptCode = await getDownloadLinkScript(url);
    if (!scriptCode) throw Error;
    const videoLinkVariable = getVideoLinkVariable(scriptCode);
    const videoUrl = await getVideoUrl(videoLinkVariable, url);
    const redirectedLink = getRedirectedLink(browser, videoUrl);
    resolve(redirectedLink);
  });
}

export function getMultipleDownloadLinks(
  browser: Browser,
  urls: string[]
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const downloadLinksPromises = urls.map((url) => {
      return getDownloadLink(browser, url);
    });
    const downloadLinksResolved = await Promise.all(downloadLinksPromises);
    const downloadLinks = downloadLinksResolved.filter(
      (link): link is string => {
        return !!link;
      }
    );
    resolve(downloadLinks);
  });
}
