import { Browser } from 'puppeteer';
import { getDownloadLink } from './get-download-links.js';

export function getSplittedLinkArray(
  links: string[],
  instanceLimit: number
): Array<string[]> {
  const splittedLinkArray: Array<string[]> = new Array();
  for (let index = 0; index < instanceLimit; index++) {
    const chunkOfLinks: string[] = new Array();
    for (
      let chunkIndex = index;
      chunkIndex < links.length;
      chunkIndex += instanceLimit
    ) {
      const link = links[chunkIndex];
      chunkOfLinks.push(link);
    }
    splittedLinkArray.push(chunkOfLinks);
  }
  return splittedLinkArray;
}

export function* getDownloadLinkGenerator(
  MultipleStreamTapeLinks: string[],
  browser: Browser
): Generator<Promise<string>> {
  for (let index = 0; index < MultipleStreamTapeLinks.length; index++) {
    const streamTapeLink = MultipleStreamTapeLinks[index];
    yield getDownloadLink(browser, streamTapeLink);
  }
}
