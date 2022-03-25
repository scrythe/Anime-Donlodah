import axios from 'axios';
import { load } from 'cheerio';
import { createContext, runInContext } from 'vm';
import { Browser } from 'puppeteer';

function getDownloadLinkScript(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const res = await axios.get(url).catch((error) => reject(error));
    if (!res) return;
    const $ = load(res.data);
    const getElementText = "document.getElementById('robotlink').innerHTML";
    const scriptCode = $(`script:contains(${getElementText})`).html();
    if (!scriptCode) return reject('element not found');
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
    if (sandBox.videoLink == 'toradora')
      return reject(`Element ${sandBox.videoLink} not found on site`);
    const url = new URL(`https:${sandBox.videoLink}`);
    resolve(url.href);
  });
}

function getRedirectedLink(browser: Browser, link: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let page = await browser.newPage();
    page.goto(link);
    const redirect = await page
      .waitForNavigation()
      .catch((error) => reject(error));
    if (!redirect) return;
    let videoDownloadLink = page.url();
    page.close();
    resolve(videoDownloadLink);
  });
}

function getDownloadLink(browser: Browser, url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const scriptCode = await getDownloadLinkScript(url).catch((error) =>
      reject(error)
    );
    if (!scriptCode) return;
    const videoLinkVariable = getVideoLinkVariable(scriptCode);
    const videoUrl = await getVideoUrl(videoLinkVariable, url).catch((error) =>
      reject(error)
    );
    if (!videoUrl) return;
    const redirectedLink = await getRedirectedLink(browser, videoUrl).catch(
      (error) => reject(error)
    );
    if (!redirectedLink) return;
    resolve(redirectedLink);
  });
}

export function getMultipleDownloadLinks(
  browser: Browser,
  urls: string[]
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const downloadLinksPromises = urls.map((url) => {
      return getDownloadLink(browser, url).catch((error) =>
        console.error(error)
      );
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
