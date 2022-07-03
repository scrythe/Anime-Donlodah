import axios from 'axios';
import { load } from 'cheerio';
import { Text } from 'domhandler';
import { Season, Episode, AllEpisodes } from './interfaces';

async function getAllSeasons(animeUrl: string): Promise<Season[]> {
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

async function getAllEpisodesOfSeason(seasonUrl: string): Promise<Episode[]> {
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

export async function getAllEpisodes(animeUrl: string): Promise<AllEpisodes> {
  const seasonsWithOutEpisodes = await getAllSeasons(animeUrl);
  const allSeasonPromises = seasonsWithOutEpisodes.map(async (season) => {
    const url = season.url;
    const name = season.name;
    const episodes = await getAllEpisodesOfSeason(url);
    return { url, name, episodes };
  });
  const allSeasons = await Promise.all(allSeasonPromises);
  return allSeasons;
}
