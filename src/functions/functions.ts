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
