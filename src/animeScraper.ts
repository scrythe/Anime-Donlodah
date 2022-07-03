import axios from 'axios';
import { load } from 'cheerio';
import { Text } from 'domhandler';

export async function getAllSeasons(animeUrl: string) {
  const res = await axios.get(animeUrl);
  const $ = load(res.data);
  const seasonElements = $(
    '#stream ul:first-child li a[title*="Staffel"]'
  ).toArray();
  const seasonDatas = seasonElements.map((seasonEl) => {
    const url = new URL(animeUrl);
    url.pathname = seasonEl.attribs['href']!;
    const name = seasonEl.attribs['title']!;
    return { url: url.toString(), name };
  });
  return seasonDatas;
}

export async function getAllEpisodesOfSeason(seasonUrl: string) {
  const res = await axios.get(seasonUrl);
  const $ = load(res.data);
  const episodeElements = $('.seasonEpisodesList tbody tr').toArray();
  const episodeDatas = episodeElements.map((episodeEl) => {
    const url = new URL(seasonUrl);
    const episodeElement = $(episodeEl);
    url.pathname = episodeElement.find('a')[0]?.attribs['href']!;
    const spanEl = episodeElement.find('span')[0]!;
    const name = (spanEl.children[0] as Text).data;
    return { url: url.toString(), name };
  });
  return episodeDatas;
}
