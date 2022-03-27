import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function getSplittedLinkArray(links: string[], instanceLimit: number) {
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
